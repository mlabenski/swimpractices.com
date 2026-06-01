export const state = () => ({
  userPractices: [],
  isLoading: false,
  seasons: [],
  totalYards: 0,
  _seasonsUnsubscribe: null,
})

export const mutations = {
  SET_SEASONS: (state, seasonData) => {
    state.seasons = seasonData
  },
  UPDATE_SEASON_PRACTICES: (state, rootPractices) => {
    if (!Array.isArray(state.seasons)) return
    for (const season of state.seasons) {
      const updatedPractices = []
      for (const practiceID of season.practices || []) {
        const matchingPractice = rootPractices?.find(
          (practice) => practice.id === practiceID
        )
        if (matchingPractice) {
          updatedPractices.push(matchingPractice)
        }
      }
      season.practices = updatedPractices
    }
  },
  SET_LOADING: (state, isLoading) => {
    state.isLoading = isLoading
  },
  ADD_PRACTICE_TO_SEASON (state, { seasonID, practiceID }) {
    if (state.seasons[seasonID]) {
      state.seasons[seasonID].practices.push(practiceID)
    }
  },
  CREATE_SEASON (state, { seasonID, seasonData }) {
    state.seasons[seasonID] = seasonData
  },
  SET_SEASONS_UNSUBSCRIBE (state, fn) {
    state._seasonsUnsubscribe = fn
  },
}

export const actions = {
  async nuxtClientInit ({ dispatch, commit }) {
    try {
      const fakeUserID = '2416d01c-e811-4f40-81c1-6ac762a89453'
      commit('auth/SET_USER', { id: fakeUserID }, { root: true })

      await dispatch('practices/fetchUserPractices', null, { root: true })
      await dispatch('practices/fetchPinnedPractices', null, { root: true })
      await dispatch('practices/fetchPractices', null, { root: true })
      await dispatch('bindSeasonPractices')
    } catch (error) {
      console.error('Error in nuxtClientInit:', error)
    }
  },

  addPracticeToSeason ({ commit }, payload) {
    commit('ADD_PRACTICE_TO_SEASON', payload)
  },

  createSeason ({ commit }, payload) {
    commit('CREATE_SEASON', payload)
  },

  bindSeasonPractices ({ commit, rootState, state }) {
    try {
      commit('SET_LOADING', true)
      const ref = this.$fire.firestore.collection('seasons')
      if (state._seasonsUnsubscribe) {
        state._seasonsUnsubscribe()
      }
      const unsubscribe = ref.onSnapshot((snapshot) => {
        const seasons = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
        commit('SET_SEASONS', seasons)
        commit('UPDATE_SEASON_PRACTICES', rootState.practices.practices)
        commit('SET_LOADING', false)
      })
      commit('SET_SEASONS_UNSUBSCRIBE', unsubscribe)
    } catch (error) {
      console.log(error)
      commit('SET_LOADING', false)
    }
  },

  unbindSeasonPractices ({ state, commit }) {
    if (state._seasonsUnsubscribe) {
      state._seasonsUnsubscribe()
      commit('SET_SEASONS_UNSUBSCRIBE', null)
    }
  },
}

export const getters = {
  seasons (state) {
    return state.seasons
  },
  getLoading (state) {
    return state.isLoading
  },
}
