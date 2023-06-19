import {vuexfireMutations, firestoreAction, firebaseAction} from 'vuexfire';

export const state = () => ({
  userPractices: [],
  isLoading: false,
  seasons: [],
  totalYards: 0,
});

export const mutations = {
  ...vuexfireMutations,
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
  seasons(state) {
    return state.seasons;
  },
  getLoading(state) {
    return state.isLoading;
  },
};
