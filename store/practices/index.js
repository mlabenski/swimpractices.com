const state = () => ({
  practices: null,
  lastFetch: null,
  filteredPractices: null,
  dailyPractice: null,
  loading: false,
  totalYards: 0,
  userPractices: null,
  practice: null,
  filter: {
    minYardage: 0,
    maxYardage: 1000,
    applied: false,
  },
  userPinnedPractices: null,
})

const mutations = {
  SET_SEARCH_TERM (state, searchTerm) {
    state.filteredPractices = state.practices.filter((practice) =>
      (practice.title || practice.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  },
  SET_PRACTICES (state, practices) {
    state.practices = practices
  },
  SET_DAILY_PRACTICES (state, practices) {
    state.dailyPractice = practices
  },
  SET_USER_PRACTICES (state, userPractices) {
    state.userPractices = userPractices
  },
  SET_LOADING (state, value) {
    state.loading = value
  },
  SET_TOTAL_YARDS (state, value) {
    state.totalYards = value
  },
  SET_FILTER (state, payload) {
    state.filter = { ...payload, applied: true }
  },
  CLEAR_FILTER (state) {
    state.filter.applied = false
  },
  SET_PRACTICE (state, practice) {
    state.practice = practice
  },
  SET_USER_PINNED_PRACTICES (state, value) {
    state.userPinnedPractices = value
  },
  UPDATE_PRACTICE (state, payload) {
    if (!state.practices) return
    const index = state.practices.findIndex((p) => p.id === payload.id)
    if (index === -1) {
      console.error(`Cannot update practice: no practice with ID ${payload.id} found.`)
      return
    }
    state.practices[index] = Object.assign(
      {},
      state.practices[index],
      payload.updates
    )
  },
  ADD_OR_UPDATE_EXERCISE_TO_SET (
    state,
    { practiceID, setIndex, exerciseIndex, property, newValue, exercise }
  ) {
    const practice = state.practices.find((p) => p.id === practiceID)
    if (!practice) return
    if (typeof newValue !== 'undefined') {
      const exerciseToUpdate = practice.sets[setIndex].exercises[exerciseIndex]
      if (exerciseToUpdate) {
        exerciseToUpdate[property] = newValue
      }
    } else {
      practice.sets[setIndex].exercises.push(exercise)
    }
  },
  ADD_OR_UPDATE_SET (state, { practiceID, set, setIndex, property, newValue }) {
    const practice = state.practices.find((p) => p.id === practiceID)
    if (!practice) return
    if (typeof setIndex !== 'undefined' && property && newValue) {
      const setToUpdate = practice.sets[setIndex]
      if (setToUpdate) {
        setToUpdate[property] = newValue
      }
    } else {
      practice.sets.push(set)
    }
  },
  CLEAR_FILTERED_PRACTICES (state) {
    state.filteredPractices = null
  },
  removePractice (state, practiceId) {
    const index = state.practices.findIndex((p) => p.id === practiceId)
    if (index !== -1) {
      state.practices.splice(index, 1)
    }
  },
  SET_FILTERED_PRACTICES (state, practices) {
    state.filteredPractices = practices
  },
  FILTER_PRACTICES_BY_USER (state, userID) {
    state.filteredPractices = state.practices.filter(
      (practice) => (practice.createdBy || practice.userID) === userID
    )
  },
  SET_LAST_FETCH (state, timestamp) {
    state.lastFetch = timestamp
  },
}

const actions = {
  async fetchDailyPractice ({ commit }) {
    const firestoreRef = this.$fire.firestore.collection('daily_practice')
    const snapshot = await firestoreRef.get()
    const practices = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    if (practices.length === 0) {
      commit('SET_DAILY_PRACTICES', [])
      return
    }
    const mergedData = practices.map((practice) => {
      let practiceTotalYards = 0
      if (practice.sets) {
        practice.sets.forEach((set) => {
          if (set.exercises && set.numRounds) {
            set.exercises.forEach((exercise) => {
              if (exercise) {
                practiceTotalYards +=
                  set.numRounds * (exercise.distance * exercise.quantity)
              }
            })
          }
        })
      }
      practice.totalYardage = practiceTotalYards
      return practice
    })
    commit('SET_DAILY_PRACTICES', mergedData)
  },

  async fetchPractices ({ commit, state }) {
    try {
      const cacheTimeout = 3000000
      const now = Date.now()

      const lastFetch = localStorage.getItem('lastFetch')
      const cachedPractices = localStorage.getItem('practices')

      if (
        lastFetch &&
        cachedPractices &&
        now - parseInt(lastFetch, 10) < cacheTimeout
      ) {
        commit('SET_PRACTICES', JSON.parse(cachedPractices))
        commit('SET_LOADING', false)
        return
      }
      commit('SET_LOADING', true)

      const firestoreRef = this.$fire.firestore.collection('practices')
      const snapshot = await firestoreRef.get()
      const practices = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))

      if (practices.length === 0) {
        throw new Error('Http error unable to load practices')
      }

      const usersPublicRef = this.$fire.firestore.collection('users_public')
      const mergedData = await Promise.all(
        practices.map(async (practice) => {
          let practiceTotalYards = 0
          if (practice.sets) {
            practice.sets.forEach((set) => {
              if (set.exercises && set.numRounds) {
                set.exercises.forEach((exercise) => {
                  if (exercise) {
                    practiceTotalYards +=
                      set.numRounds * (exercise.distance * exercise.quantity)
                  }
                })
              }
            })
          }
          practice.totalYardage = practiceTotalYards

          const ownerID = practice.createdBy || practice.userID
          if (ownerID) {
            const userDoc = await usersPublicRef.doc(ownerID).get()
            if (userDoc.exists) {
              practice.userData = userDoc.data()
            }
          }

          return practice
        })
      )

      localStorage.setItem('practices', JSON.stringify(mergedData))
      localStorage.setItem('lastFetch', now.toString())

      commit('SET_PRACTICES', mergedData)
      commit('SET_LAST_FETCH', now)
    } catch (error) {
      console.error('Error fetching practices:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchUserPractices ({ commit, rootState }) {
    try {
      commit('SET_LOADING', true)
      const userID = rootState.auth.user?.id
      if (!userID) return

      const ref = this.$fire.firestore
        .collection('practices')
        .where('createdBy', '==', userID)
      const snapshot = await ref.get()
      const userPractices = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))

      let totalYards = 0
      userPractices.forEach((practice) => {
        practice.sets?.forEach((set) => {
          set.exercises?.forEach((exercise) => {
            totalYards += exercise.distance * exercise.quantity
          })
        })
      })
      commit('SET_USER_PRACTICES', userPractices)
      commit('SET_TOTAL_YARDS', totalYards)
    } catch (error) {
      console.error('Error fetching user practices:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchPracticeByID ({ state, commit }, id) {
    if (state.practices) {
      const practice = state.practices.find((p) => p.id === id)
      if (practice) {
        commit('SET_PRACTICE', practice)
        return
      }
    }

    if (state.dailyPractice?.length > 0) {
      const dailyPractice = state.dailyPractice[0]
      if (dailyPractice.id === id) {
        commit('SET_PRACTICE', dailyPractice)
        return
      }
    }

    const docRef = this.$fire.firestore.collection('practices').doc(id)
    const doc = await docRef.get()

    if (doc.exists) {
      commit('SET_PRACTICE', { id, ...doc.data() })
      return
    }

    const dailyRef = this.$fire.firestore.collection('daily_practice').doc(id)
    const dailyDoc = await dailyRef.get()

    if (dailyDoc.exists) {
      commit('SET_PRACTICE', { id, ...dailyDoc.data() })
    } else {
      console.log('Practice not found')
    }
  },

  async fetchPinnedPractices ({ rootState, commit }) {
    try {
      if (rootState.auth.user) {
        const userID = rootState.auth.user.id
        const ref = this.$fire.firestore.collection('users_private').doc(userID)
        const doc = await ref.get()

        if (doc.exists) {
          const data = doc.data()
          commit(
            'SET_USER_PINNED_PRACTICES',
            data.pinnedPractices || []
          )
        } else {
          commit('SET_USER_PINNED_PRACTICES', [])
        }
      } else {
        commit('SET_USER_PINNED_PRACTICES', [])
      }
    } catch (error) {
      console.error(
        'Error fetching pinned practices (likely permissions):',
        error.message
      )
      commit('SET_USER_PINNED_PRACTICES', [])
    }
  },

  filterPracticesByUser ({ commit, rootState }) {
    if (rootState.auth.user?.id) {
      commit('FILTER_PRACTICES_BY_USER', rootState.auth.user.id)
    }
  },

  clearFilteredPractices ({ commit }) {
    commit('CLEAR_FILTERED_PRACTICES')
  },

  applyFilter (
    { commit, state },
    { minYardage, maxYardage, strokes, showPinnedOnly }
  ) {
    if (showPinnedOnly && state.userPinnedPractices) {
      const pinnedPracticeIds = state.userPinnedPractices || []
      const filteredPractices = state.practices.filter((practice) =>
        pinnedPracticeIds.includes(practice.id)
      )
      commit('SET_FILTERED_PRACTICES', filteredPractices)
    } else {
      const filteredPractices = state.practices.filter(
        (practice) =>
          practice.totalYardage >= minYardage &&
          practice.totalYardage <= maxYardage &&
          (strokes.length === 0 || strokes.includes(practice.primaryStroke))
      )
      commit('SET_FILTERED_PRACTICES', filteredPractices)
    }
  },

  clearFilter ({ commit }) {
    commit('CLEAR_FILTER')
  },

  addExerciseToSet ({ commit }, payload) {
    commit('ADD_OR_UPDATE_EXERCISE_TO_SET', payload)
  },

  addOrUpdateExerciseToSet ({ commit }, payload) {
    commit('ADD_OR_UPDATE_EXERCISE_TO_SET', payload)
  },

  addOrUpdateSet ({ commit }, payload) {
    commit('ADD_OR_UPDATE_SET', payload)
  },

  updatePractice ({ commit }, payload) {
    commit('UPDATE_PRACTICE', payload)
  },

  searchPractices ({ commit }, searchTerm) {
    commit('SET_SEARCH_TERM', searchTerm)
  },

  async savePractice ({ rootState }, practiceId) {
    const userID = rootState.auth.user?.id
    if (!userID) return { success: false, message: 'Not authenticated' }

    const userRef = this.$fire.firestore.collection('users_private').doc(userID)
    try {
      await userRef.update({
        pinnedPractices: this.$fireModule.firestore.FieldValue.arrayUnion(
          practiceId
        ),
      })
      return { success: true }
    } catch (error) {
      console.error('Error saving practice: ', error)
      return { success: false, message: error.message }
    }
  },
}

const getters = {
  practices (state) {
    return state.practices
  },
  dailyPractice (state) {
    if (state.dailyPractice?.length > 0) {
      return state.dailyPractice[0]
    }
    return null
  },
  userPractices (state) {
    return state.userPractices
  },
  userPinnedPractices (state) {
    return state.userPinnedPractices
  },
  filteredPractices: (state) => {
    if (state.filteredPractices) return state.filteredPractices
    if (!state.filter.applied) return state.practices
    return state.practices
  },
  uniqueStrokes (state) {
    const strokesSet = new Set()
    state.practices?.forEach((practice) => {
      strokesSet.add(practice.primaryStroke)
    })
    return [...strokesSet]
  },
  isLoading: (state) => state.loading,
  getPracticeByID: (state) => (id) => {
    if (Array.isArray(state.practices)) {
      return state.practices.find((practice) => practice.id === id)
    }
    if (state.practices && typeof state.practices === 'object') {
      return state.practices[id]
    }
    return null
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
