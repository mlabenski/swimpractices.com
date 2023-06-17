import {vuexfireMutations, firestoreAction, firebaseAction} from 'vuexfire';

export const state = () => ({
  practices: [],
  practicesNew: {},
  userPractices: [],
  isLoading: false,
  seasons: [],
  totalYards: 0,
});

export const mutations = {
  ...vuexfireMutations,
  SET_PRACTICES: (state, practices) => {
    state.practicesNew = practices;
  },
  SET_PRACTICES_NEW: (state, practices) => {
    state.practices = practices;
  },
  SET_TOTAL_YARDS(state, yards) {
    state.totalYards = yards;
  },
  SET_USER_PRACTICES: (state, userPractices) => {
    state.userPractices = userPractices;
  },
  SET_SEASONS: (state, seasonData) => {
    state.seasons = seasonData;
  },
  UPDATE_SEASON_PRACTICES: (state) => {
    // Loop through each season
    for (let season of state.seasons) {
      // Create a new array for the updated practices
      let updatedPractices = [];

      // Loop through each practice ID in the current season
      for (let practiceID of season.practices) {
        // Find the corresponding practice in the Vuex state
        let practice = state.practices.find(practice => practice.id === practiceID);

        // If a matching practice is found, add it to the updatedPractices array
        if (practice) {
          updatedPractices.push(practice);
        }
      }

      // Update the current season's practices array with the updatedPractices array
      season.practices = updatedPractices;
    }
  },
  SET_LOADING: (state, isLoading) => {
    state.isLoading = isLoading;
  }
};

export const actions = {
  async fetchPractices({ commit }) {
    commit('SET_LOADING', true);
    try {
      const response = await fetch('https://swimpractices.s3.us-east-2.amazonaws.com/backup_1686931575097.json');
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      const practices = await response.json();
      commit('SET_PRACTICES_NEW', practices);

    } catch (error) {
      console.log('Fetch Error: ', error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  bindPracticesOld: firestoreAction(async function ({ bindFirestoreRef, commit }) {
    try {
      commit('SET_LOADING', true)
      const ref = this.$fire.firestore.collection('practices');
      await bindFirestoreRef('practices', ref, { wait: true });
    } catch (error) {

    } finally {
      commit('SET_LOADING', false)
    }
  }),
  bindPractices: firestoreAction(async function ({ bindFirestoreRef, commit }) {
    try {
      commit('SET_LOADING', true)
      const ref = this.$fire.firestore.collection('practices');
      await bindFirestoreRef('practices', ref, { wait: true });

      let totalYards = 0;
      state.practices.forEach(practice => {
        practice.sets.forEach(set => {
          set.exercises.forEach(exercise => {
            totalYards += exercise.distance * exercise.quantity;
          });
        });
      });
      commit('SET_TOTAL_YARDS', totalYards);

    } catch (error) {
      // handle error
    } finally {
      commit('SET_LOADING', false)
    }
  }),
  bindUserPractices: firestoreAction(async function ({ bindFirestoreRef, rootState }) {
    console.log('test')
    const userID = rootState.auth.user.id;
    const ref = this.$fire.firestore.collection('practices').where('userID', '==', userID);
    await bindFirestoreRef('userPractices', ref, { wait: true });
  }),
  bindSeasonPractices: firestoreAction(async function ({ bindFirestoreRef, commit }) {
    try {
      commit('SET_LOADING', true)
      const ref = this.$fire.firestore.collection('seasons');
      await bindFirestoreRef('seasons', ref, { wait: true });
      commit('UPDATE_SEASON_PRACTICES');
    } catch (error) {
    console.log(error);
    } finally {
      commit('SET_LOADING', false)
    }
  }),
  unbindPractices: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('practices', false);
  }),
  unbindUserPractices: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('userPractices', false);
  }),
  unbindSeasonPractices: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('seasonPractices', false);
  }),
};

export const getters = {
  practices(state) {
    return state.practices;
  },
  userPractices(state) {
    return state.userPractices;
  },
  seasons(state) {
    return state.seasons;
  },
  getPracticeByID: (state) => (id) => {
    console.log('id is'+ id);
    return state.practicesNew.find((practice) => practice[id] === id)
  },
  getLoading(state) {
    return state.isLoading;
  },
  newPractices(state) {
    return state.practicesNew
  }
};
