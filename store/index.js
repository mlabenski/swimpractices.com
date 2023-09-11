import {vuexfireMutations, firestoreAction, firebaseAction} from 'vuexfire';

export const state = () => ({
  userPractices: [],
  isLoading: false,
  seasons: {},
  totalYards: 0,
});

export const mutations = {
  ...vuexfireMutations,
  SET_SEASONS: (state, seasonData) => {
    state.seasons = seasonData;
  },
  UPDATE_SEASON_PRACTICES: (state, rootPractices) => {
    // Loop through each season
    for (let season of state.seasons) {
      // Create a new array for the updated practices
      let updatedPractices = [];

      // Loop through each practice ID in the current season
      for (let practiceID of season.practices) {
        // Check if the practice exists in the Vuex state
        let matchingPractice = rootPractices.find(practice => practice.id === practiceID);
        if (matchingPractice) {
          // If a matching practice is found, add it to the updatedPractices array
          updatedPractices.push(matchingPractice);
        }
      }

      // Update the current season's practices array with the updatedPractices array
      season.practices = updatedPractices;
    }
  },
  SET_LOADING: (state, isLoading) => {
    state.isLoading = isLoading;
  },
  ADD_PRACTICE_TO_SEASON(state, { seasonID, practiceID }) {
    state.seasons[seasonID].practices.push(practiceID);
  },
  CREATE_SEASON(state, { seasonID, seasonData }) {
    state.seasons[seasonID] = seasonData;
  }
};

export const actions = {
  addPracticeToSeason({ commit }, payload) {
    commit('ADD_PRACTICE_TO_SEASON', payload);
  },
  createSeason({ commit }, payload) {
    commit('CREATE_SEASON', payload);
  },
  bindSeasonPractices: firestoreAction(async function ({ bindFirestoreRef, commit, rootState }) {
    try {
      commit('SET_LOADING', true);
      console.log('inside bind seasons')
      const ref = this.$fire.firestore.collection('seasons');
      await bindFirestoreRef('seasons', ref, { wait: true });
      commit('UPDATE_SEASON_PRACTICES', rootState.practices.practices);
    } catch (error) {
      console.log(error);
    } finally {
      commit('SET_LOADING', false);
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
