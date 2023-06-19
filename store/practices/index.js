// /store/practices/index.js

const state = () => ({
  practices: {},
  loading: false,
  userPractices: {},
  filters: {} // add new property for filters
});

const mutations = {
  SET_PRACTICES_NEW(state, practices) {
    console.log('setting practices to: '+ practices);
    state.practices = practices;
  },
  SET_USER_PRACTICES(state, userPractices) {
    console.log('setting user practices to: '+ userPractices);
    state.userPractices = userPractices;
  },
  SET_LOADING(state, value) {
    state.loading = value;
  },
  SET_FILTERS(state, filters) { // new mutation to set filters
    state.filters = filters;
  }
}

const actions = {
  async fetchPractices({ commit }) {
    try {
      commit('SET_LOADING', true);
      const response = await fetch('https://swimpractices.s3.us-east-2.amazonaws.com/backup_1686931575097.json');
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      const practices = await response.json();
      console.log(practices);
      commit('SET_PRACTICES_NEW', practices);

    } catch (error) {
      console.log('Fetch Error: ', error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  async fetchUserPractices({ commit }) {
    console.log('did u run?')
    try {
      commit('SET_LOADING', true);
      const response = await fetch('https://swimpractices.s3.us-east-2.amazonaws.com/backup_1686931575097.json');
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      const practices = await response.json();
      commit('SET_USER_PRACTICES', practices);

    } catch (error) {
      console.log('Fetch Error: ', error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  updateFilters({ commit }, filters) { // new action to trigger filter updates
    commit('SET_FILTERS', filters);
  }
}

const getters = {
  practices(state) {
    return state.practices;
  },
  userPractices: (state, getters, rootState) => {
    if(!rootState.auth.user){
      return console.log('not signed in, retrieving no user practices')
    }
    if(rootState.auth.user){
      const userID = rootState.auth.user.id;
      console.log(userID)
      console.log(state.practices)
      console.log(Object.values(state.practices).filter(practice => practice.userID === userID));
      return Object.values(state.practices).filter(practice => practice.userID === userID);
    }
    console.log('no user found --- error really')
  },
  isLoading: state => state.loading,
  filters: state => state.filters, // new getter for filters,
}

export default {
  namedspaced: true,
  state,
  getters,
  actions,
  mutations
}
