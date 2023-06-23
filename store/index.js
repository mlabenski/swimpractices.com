import {vuexfireMutations, firestoreAction, firebaseAction} from 'vuexfire';
import {root} from "postcss";

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
    console.log('do u even have the seasons here');
    console.log(rootPractices)
    for (let season of state.seasons) {
      // Create a new object for the updated practices
      let updatedPractices = {};
      console.log('testing if ur running')

      // Loop through each practice ID in the current season
      for (let practiceID of season.practices) {
        console.log('showing season practices')
        console.log(practiceID)
        // Check if the practice exists in the Vuex state
        if (rootPractices.hasOwnProperty(practiceID)) {
          console.log('ran twice')
          // If a matching practice is found, add it to the updatedPractices object
          updatedPractices[practiceID] = rootPractices[practiceID];
        }
      }

      // Update the current season's practices object with the updatedPractices object
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
