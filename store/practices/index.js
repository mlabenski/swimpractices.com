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

  ADD_EXERCISE_TO_SET(state, { practiceID, setIndex, exercise }) {
    const practice = state.practices[practiceID];
      if (practice) {
        console.log('set index is ' +setIndex);
        console.log('appending exercise'+ exercise);
        practice.sets[setIndex].exercises.push(exercise);
        console.log('completed')
      }
    }
}

const actions = {
  async fetchPractices({ commit }) {
    try {
      commit('SET_LOADING', true);
      const response = await fetch('https://swimpractices.s3.us-east-2.amazonaws.com/backup.json');
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
      const response = await fetch('https://swimpractices.s3.us-east-2.amazonaws.com/backup.json');
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
  addExerciseToSet({ commit }, payload) {
    commit('ADD_EXERCISE_TO_SET', payload);
  },
  updateFilters({ commit }, filters) { // new action to trigger filter updates
    commit('SET_FILTERS', filters);
  },
  updatePractice({ commit }, payload) {
    commit('UPDATE_PRACTICE', payload);
  },

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

      return Object.keys(state.practices)
        .reduce((acc, practiceID) => {
          if(state.practices[practiceID].userID === userID) {
            acc[practiceID] = {
              id: practiceID,
              ...state.practices[practiceID]
            };
          }
          return acc;
        }, {});
    }
    console.log('no user found --- error really')
  },

  isLoading: state => state.loading,
  filters: state => state.filters, // new getter for filters,
  getPracticeByID: (state) => (id) => {
    return state.practices[id];
  },
}

export default {
  namedspaced: true,
  state,
  getters,
  actions,
  mutations
}
