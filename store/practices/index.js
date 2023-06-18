// /store/practices/index.js
import { firestoreAction } from 'vuexfire'

export const state = () => ({
  practices: {},
  loading: false,
  filters: {} // add new property for filters
});

export const mutations = {
  SET_PRACTICES_NEW(state, practices) {
    state.practices = practices;
  },
  SET_LOADING(state, value) {
    state.loading = value;
  },
  SET_FILTERS(state, filters) { // new mutation to set filters
    state.filters = filters;
  }
}

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
  updateFilters({ commit }, filters) { // new action to trigger filter updates
    commit('SET_FILTERS', filters);
  }
}

export const getters = {
  practices(state) {
    return state.practices;
  },
  isLoading: state => state.loading,
  filters: state => state.filters, // new getter for filters,
  userPractices: (state, getters, rootState) => {
    if(!rootState.auth.user){
      return console.log('not signed in, retrieving no user practices')
    }
    const userID = rootState.auth.user.id;
    return Object.values(state.practices).filter(practice => practice.userID === userID);
  },
}
