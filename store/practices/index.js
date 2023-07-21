// /store/practices/index.js

import {firestoreAction} from "vuexfire";

const state = () => ({
  practices: {},
  practice: {},
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

  ADD_OR_UPDATE_EXERCISE_TO_SET(state, { practiceID, setIndex, exercise, exerciseIndex, property, newValue }) {
    const practice = state.practices[practiceID];
    if (practice) {
      if (typeof exerciseIndex !== 'undefined' && property && newValue) {
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
    const practice = state.practices[practiceID];
    if (practice) {
      if (typeof setIndex !== 'undefined' && property && newValue) {
        // Update existing set property
        console.log('property is '+ property)
        console.log('update an existing set here')
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
  bindPractice: firestoreAction(async function ({ bindFirestoreRef, commit, state }, id) {
    try {
      commit('SET_LOADING', true)

      // Get reference to the specific practice by id
      const ref = this.$fire.firestore.collection('practices').doc(id);
      await bindFirestoreRef('practice', ref, { wait: true });

      let totalYards = 0;

      // Calculate the total yards for the specific practice
      if (state.practice) {
        state.practice.sets.forEach(set => {
          set.exercises.forEach(exercise => {
            totalYards += exercise.distance * exercise.quantity;
          });
        });
      }

      commit('SET_TOTAL_YARDS', totalYards);
    } catch (error) {
      // handle error
    } finally {
      commit('SET_LOADING', false)
    }
  }),


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
      if(state.practices[id]) {
        console.log('found a practice with the id');
        return state.practices[id];
      }
      else {
        console.log('unable to find ID')
      }
    },
  practice: (state) => state.practice
}

export default {
  namedspaced: true,
  state,
  getters,
  actions,
  mutations
}
