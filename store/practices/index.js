// /store/practices/index.js
import {vuexfireMutations, firestoreAction, firebaseAction} from 'vuexfire';

const state = () => ({
  practices: null,
  lastFetch: null,
  filteredPractices: null,
  dailyPractice: null,
  loading: false,
  totalYards: 0,
  userPractices: null,
  filter: {            // filter criteria
    minYardage: 0,
    maxYardage: 1000,
    applied: false,
  },
  userPinnedPractices: null
});

const mutations = {
  SET_SEARCH_TERM(state, searchTerm) {
    state.filteredPractices = state.practices.filter(practice => {
        return practice.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  },
  SET_PRACTICES_NEW(state, practices) {
    console.log('setting practices to: '+ practices);
    state.practices = practices;
  },
  SET_PRACTICES(state, practices) {
    state.practices = practices;
  },
  SET_DAILY_PRACTICES(state, practices) {
    state.dailyPractice = practices;
  },
  SET_USER_PRACTICES(state, userPractices) {
    console.log('setting user practices to: '+ userPractices);
    state.userPractices = userPractices;
  },
  SET_LOADING(state, value) {
    state.loading = value;
  },
  SET_TOTAL_YARDS(state, value) {
    state.totalYards = value;
  },
  SET_FILTER(state, payload) {
    state.filter = { ...payload, applied: true };
  },
  CLEAR_FILTER(state) {
    state.filter.applied = false;
  },
  SET_PRACTICE(state, practice) {
    state.practice = practice;
  },
  SET_USER_PINNED_PRACTICES(state, value) {
    state.userPinnedPractices = value;
  },
  UPDATE_PRACTICE(state, payload) {
    // Ensure the practice exists
    if (!state.practices.hasOwnProperty(payload.id)) {
      console.error(`Cannot update practice: no practice with ID ${payload.id} found.`);
      return;
    }
    // Update the practice
    state.practices[payload.id] = Object.assign({}, state.practices[payload.id], payload.updates);
  },

  ADD_OR_UPDATE_EXERCISE_TO_SET(state, { practiceID, setIndex, exerciseIndex, property, newValue, exercise }) {
    const practice = state.practices.find(practice => practice.id === practiceID);
    console.log(`will make an edit to ${practice}`)
    if (practice) {
      if (typeof newValue !== 'undefined') {
        // Update existing exercise property
        console.log('property is '+ property)
        console.log('update an existing exercise here')
        const exerciseToUpdate = practice.sets[setIndex].exercises[exerciseIndex];
        console.log('exercise found is:')
        console.log(exerciseToUpdate)
        if (exerciseToUpdate) {
          exerciseToUpdate[property] = newValue;
          console.log('done')
        }
      } else {
        // Add new exercise to set
        console.log('add new exercise here')
        practice.sets[setIndex].exercises.push(exercise);
      }
    }
  },
  ADD_OR_UPDATE_SET(state, { practiceID, set, setIndex, property, newValue }) {
    const practice = state.practices.find(practice => practice.id === practiceID);
    if (practice) {
      if (typeof setIndex !== 'undefined' && property && newValue) {
        // Update existing set property
        console.log('property is '+ property)
        const setToUpdate = practice.sets[setIndex];
        console.log('set found is:')
        console.log(setToUpdate)
        if (setToUpdate) {
          setToUpdate[property] = newValue;
          console.log('done')
        }
      } else {
        // Add new set to practice
        console.log('add new set here')
        practice.sets.push(set);
      }
    }
  },
  CLEAR_FILTERED_PRACTICES(state) {
    state.filteredPractices = null; // or set it to the initial state
  },
  removePractice(state, practiceId) {
    const index = state.practices.findIndex(p => p.practiceId === practiceId);
    if (index !== -1) {
      state.practices.splice(index, 1);
    }
  },
  SET_FILTERED_PRACTICES(state, practices) {
    state.filteredPractices = practices;
  },
  FILTER_PRACTICES_BY_USER(state, userID) {
    state.filteredPractices = state.practices.filter(practice => practice.userID === userID)
  },
  SET_LAST_FETCH(state, timestamp) {
    console.log('last fetch!');
    state.lastFetch = timestamp;
  }
}

const actions = {

  fetchDailyPractice: firestoreAction(async function ({ commit, state }) {
    const firestoreRef = this.$fire.firestore.collection('daily_practice');
    const snapshot = await firestoreRef.get();
    const practices = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id}));
    if (practices.length === 0) {
      console.log('practice length error')
      throw new Error('Failed to read the daily practice!');
    }
    //compute total yardage for the practice
    const mergedData = await Promise.all(practices.map(async (practice) => {
      // Compute totalYardage for each practice
      let practiceTotalYards = 0;
      if (practice.sets) {
        practice.sets.forEach(set => {
          if (set.exercises && set.numRounds) {
            set.exercises.forEach(exercise => {
              if (exercise) {
                practiceTotalYards += set.numRounds * (exercise.distance * exercise.quantity);
              }
            });
          }
        });
      }
      practice.totalYardage = practiceTotalYards;  // Store the total yardage directly in the practice object
      return practice;
    }));
    commit('SET_DAILY_PRACTICES', mergedData);
  }

  ),

  fetchPractices: firestoreAction(async function ({ commit, state }) {
    try {
      const cacheTimeout = 3000000;
      const now = Date.now();

      const lastFetch = localStorage.getItem('lastFetch');
      const cachedPractices = localStorage.getItem('practices');

      if (lastFetch && cachedPractices && (now - parseInt(lastFetch) < cacheTimeout)) {
        console.log('We have cached data - no firebase requests!');
        commit('SET_PRACTICES', JSON.parse(cachedPractices));  // Assuming the data structure aligns with what's expected
        commit('SET_LOADING', false);
        return;  // Use cached data
      }
      commit('SET_LOADING', true);


      // Fetch Firestore data
      const firestoreRef = this.$fire.firestore.collection('practices');
      const snapshot = await firestoreRef.get();
      const practices = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      if (practices.length === 0) {
        throw new Error('Http error unable to load practices');
      }

      const usersRef = this.$fire.firestore.collection('users');
      const mergedData = await Promise.all(practices.map(async (practice) => {
        // Compute totalYardage for each practice
        let practiceTotalYards = 0;
        if (practice.sets) {
          practice.sets.forEach(set => {
            if (set.exercises && set.numRounds) {
              set.exercises.forEach(exercise => {
                if (exercise) {
                  practiceTotalYards += set.numRounds * (exercise.distance * exercise.quantity);
                }
              });
            }
          });
        }
        practice.totalYardage = practiceTotalYards;  // Store the total yardage directly in the practice object

        // Fetch and merge user data
        if (practice.userID) {
          const userDoc = await usersRef.doc(practice.userID).get();
          if (userDoc.exists) {
            practice.userData = userDoc.data();
          }
        }

        return practice;
      }));

      // Cache the practices and the fetch timestamp in local storage
      localStorage.setItem('practices', JSON.stringify(mergedData));
      localStorage.setItem('lastFetch', now.toString());

      commit('SET_PRACTICES', mergedData);
      commit('SET_LAST_FETCH', now);

    } catch (error) {
      console.error("Error fetching practices:", error);
    } finally {
      commit('SET_LOADING', false);
    }
  }),

  fetchUserPractices: firestoreAction(async function ({ commit, rootState }) {
    try {
      commit('SET_LOADING', true)
      const userID = rootState.auth.user.id;
      const ref = this.$fire.firestore.collection('practices').where('userID', '==', userID);
      const snapshot = await ref.get();
      const userPractices = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      let totalYards = 0;
      userPractices.forEach(practice => {
        practice.sets.forEach(set => {
          set.exercises.forEach(exercise => {
            totalYards += exercise.distance * exercise.quantity;
          });
        });
      });
      commit('SET_USER_PRACTICES', userPractices);  // Assumes there is a mutation to handle this
      commit('SET_TOTAL_YARDS', totalYards);
    } catch (error) {
      console.error("Error fetching user practices:", error);
    } finally {
      commit('SET_LOADING', false)
    }
  }),

  fetchPracticeByID: firestoreAction(async function({ state, commit }, id) {
    // First, check if state.practices exists and try to find the practice in it
    if (state.practices) {
      const practice = state.practices.find(practice => practice.id === id);
      if (practice) {
        commit('SET_PRACTICE', practice);
        return;
      }
    }

    // If we didn't return above, we either don't have state.practices or didn't find the practice in it.
    // In this case, fetch the practice from Firestore.
    const ref = this.$fire.firestore.collection('practices').doc(id);
    const doc = await ref.get();

    if (doc.exists) {
      // Commit the practice to the Vuex store
      commit('SET_PRACTICE', { id, ...doc.data() });
    } else {
      console.log('Practice not found');
    }
  }),

  fetchPinnedPractices: firestoreAction(async function({ rootState, commit }) {
    if (rootState.auth.user) {
      const userID = rootState.auth.user.id;
      const ref = this.$fire.firestore.collection('users').doc(userID);
      const doc = await ref.get();

      if (doc.exists) {
        const data = doc.data();
        console.log(data);  // Optional: for debugging, can be removed in production
        if (data.pinnedPractices) {
          commit('SET_USER_PINNED_PRACTICES', data.pinnedPractices);
        } else {
          // Handle the case where there are no pinned practices
          commit('SET_USER_PINNED_PRACTICES', []);
        }
      } else {
        // If the user document does not exist
        console.log('User document not found');
        commit('SET_USER_PINNED_PRACTICES', []);
      }
    } else {
      // If there is no authenticated user
      commit('SET_USER_PINNED_PRACTICES', []);
    }
  }),

  filterPracticesByUser({ commit, rootState }) {
    if(rootState.auth.user && rootState.auth.user.id) {
      commit('FILTER_PRACTICES_BY_USER', rootState.auth.user.id);
    }
  },
  clearFilteredPractices({ commit }) {
    commit('CLEAR_FILTERED_PRACTICES');
  },

  applyFilter({ commit, state }, { minYardage, maxYardage, strokes, showPinnedOnly }) {
    if(showPinnedOnly && state.userPinnedPractices) {
      console.log('apply pinned practice filter')
      console.log(filteredPractices)
      //only show the pinned practices, this can be extended later to allow more filters on top of the pinned practices
      const pinnedPracticeIds = state.userPinnedPractices || [];
      let filteredPractices = state.practices.filter(practice =>
        pinnedPracticeIds.includes(practice.id)
      );
      commit('SET_FILTERED_PRACTICES', filteredPractices);
    }
    else {
      console.log('apply normal filter')
      console.log(filteredPractices)
      let filteredPractices = state.practices.filter(practice => {
        return practice.totalYardage >= minYardage &&
               practice.totalYardage <= maxYardage &&
               (strokes.length === 0 || strokes.includes(practice.primaryStroke));
      });
      console.log(filteredPractices)
      commit('SET_FILTERED_PRACTICES', filteredPractices);
    }
  },
  clearFilter({ commit }) {
    commit('CLEAR_FILTER');
  },
  addExerciseToSet({ commit }, payload) {
    commit('ADD_OR_UPDATE_EXERCISE_TO_SET', payload);
  },
  addOrUpdateExerciseToSet({ commit }, payload) {
    commit('ADD_OR_UPDATE_EXERCISE_TO_SET', payload);
  },
  addOrUpdateSet({ commit }, payload) {
    commit('ADD_OR_UPDATE_SET', payload);
  },
  updateFilters({ commit }, filters) { // new action to trigger filter updates
    commit('SET_FILTERS', filters);
  },
  updatePractice({ commit }, payload) {
    commit('UPDATE_PRACTICE', payload);
  },
  searchPractices({ commit }, searchTerm) {
    commit('SET_SEARCH_TERM', searchTerm);
  },
  unbindPractices: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('practices', false);
  }),
  unbindUserPractices: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('userPractices', false);
  }),
  async savePractice({ state, commit }, rootState, practiceId) {
    // This function saves a practice ID to the user data collection
    // It could be improved for free users by offering a cache system
    const userID = rootState.auth.user.id;

    const userRef = firebase.firestore().collection('userData').doc(userId);

    try {
        await userRef.update({
            likes: firebase.firestore.FieldValue.arrayUnion(practiceId)
        });
        // You can commit any changes to the state here if needed.
        // e.g. commit('ADD_LIKE', practiceId);
        return { success: true };  // Indicate success
    } catch (error) {
        console.error('Error saving practice: ', error);
        return { success: false, message: error.message };  // Indicate failure with a message
    }
},

}

const getters = {
  practices(state) {
    return state.practices;
  },
  dailyPractice(state) {
    return state.dailyPractice[0];
  },
  userPractices(state) {
    return state.userPractices;
  },
  userPinnedPractices(state) {
    return state.userPinnedPractices;
  },
  filteredPractices: state => {
    if(state.filteredPractices) return state.filteredPractices;
    else if (!state.filter.applied) return state.practices;
  },
  uniqueStrokes(state) {
    console.log('calling unique strokes')
    const strokesSet = new Set();
    state.practices.forEach(practice => {
      strokesSet.add(practice.primaryStroke);
    });
    console.log('loggigng unique strokes');
    console.log(strokesSet)
    return [...strokesSet];
  },

  isLoading: state => state.loading,
  filters: state => state.filters, // new getter for filters,
  getPracticeByID: (state) => (id) => {
    return async () => {
      let practice;

      if (Array.isArray(state.practices)) {
        // If state.practices is an array, use the find method
        console.log('If statement 1: Array')
        practice = state.practices.find(practice => practice.id === id);
      } else if (state.practices && typeof state.practices === 'object') {
        console.log('If statement 2: Object')
        // If state.practices is an object, use the id as a key
        practice = state.practices[id];
      } else if (state.practices === null) {
        console.log('If statement 3: Array')
        // If state.practices is null, fetch the practice from Firestore

        const doc = await this.$fire.firestore.collection('practices').doc(id).get();
        if (doc.exists) {
          practice = doc.data();
          practice.id = doc.id; // add the document id to the practice object
        }
      }

      if (practice) {
        console.log('found a practice with the id');
        return practice;
      } else {
        console.log('unable to find ID');
      }
    }
  },
}


export default {
  namedspaced: true,
  state,
  getters,
  actions,
  mutations
}
