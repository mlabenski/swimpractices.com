// /store/practices/index.js
import {vuexfireMutations, firestoreAction, firebaseAction} from 'vuexfire';

const state = () => ({
  practices: null,
  loading: false,
  totalYards: 0,
  userPractices: null,
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
  SET_TOTAL_YARDS(state, value) {
    state.totalYards = value;
  },
  SET_FILTERS(state, filters) { // new mutation to set filters
    state.filters = filters;
  },
  SET_PRACTICE(state, practice) {
    state.practice = practice;
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
}

const actions = {
  fetchPractices: firestoreAction(async function ({ bindFirestoreRef, commit, state }) {
    try {
      commit('SET_LOADING', true);

      // Fetch Firestore data
      const firestoreRef = this.$fire.firestore.collection('practices');
      await bindFirestoreRef('practices', firestoreRef, { wait: true });

      // Fetch S3 bucket data
      const response = await fetch('https://swimpractices.s3.us-east-2.amazonaws.com/backup.json');
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      const s3Data = await response.json();

      // Transform the S3 bucket data to an array of objects
      const s3DataArray = Object.keys(s3Data).map(id => {
        return { id, ...s3Data[id] };
      });

      // Merge Firestore and S3 data
      const mergedData = [...state.practices, ...s3DataArray];
      commit('SET_PRACTICES', mergedData);

      let totalYards = 0;
      mergedData.forEach(practice => {
        practice.sets.forEach(set => {
          set.exercises.forEach(exercise => {
            totalYards += exercise.distance * exercise.quantity;
          });
        });
      });

      commit('SET_TOTAL_YARDS', totalYards);

    } catch (error) {
      console.error(error);
    } finally {
      commit('SET_LOADING', false)
    }
  }),
  fetchUserPractices: firestoreAction(async function ({ bindFirestoreRef, rootState, commit}) {
    try {
      commit('SET_LOADING', true)
      const userID = rootState.auth.user.id;
      const ref = this.$fire.firestore.collection('practices').where('userID', '==', userID);
      await bindFirestoreRef('userPractices', ref, { wait: true });
      let totalYards = 0;
      state.userPractices.forEach(practice => {
        practice.sets.forEach(set => {
          set.exercises.forEach(exercise => {
            totalYards += exercise.distance * exercise.quantity;
          });
        });
      });
      commit('SET_TOTAL_YARDS', totalYards);
    } catch (error) {

    } finally {
      commit('SET_LOADING', false)
    }
    console.log('test')
  }),
  fetchPracticeByID: firestoreAction(async function({ state, bindFirestoreRef, commit }, id) {
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
  unbindPractices: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('practices', false);
  }),
  unbindUserPractices: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('userPractices', false);
  }),

}

const getters = {
  practices(state) {
    return state.practices;
  },
  userPractices(state) {
    return state.userPractices;
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
