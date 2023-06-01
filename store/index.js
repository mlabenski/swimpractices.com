import { vuexfireMutations, firestoreAction } from 'vuexfire';

export const state = () => ({
  practices: [],
  userPractices: [],
  isLoading: false,
});

export const mutations = {
  ...vuexfireMutations,
  SET_PRACTICES: (state, practices) => {
    state.practices = practices;
  },
  SET_USER_PRACTICES: (state, userPractices) => {
    state.userPractices = userPractices;
  },
  SET_LOADING: (state, isLoading) => {
    state.isLoading = isLoading;
  }
};

export const actions = {
  bindPractices: firestoreAction(async function ({ bindFirestoreRef, commit }) {
    try {
      commit('SET_LOADING', true)
      const ref = this.$fire.firestore.collection('practices');
      await bindFirestoreRef('practices', ref, { wait: true });
    } catch (error) {

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
  unbindPractices: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('practices', false);
  }),
  unbindUserPractices: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('userPractices', false);
  }),
};

export const getters = {
  practices(state) {
    return state.practices;
  },
  userPractices(state) {
    return state.userPractices;
  },
  getPracticeByID: (state) => (id) => {
    return state.practices.find((practice) => practice.id === id)
  },
  getLoading(state) {
    return state.isLoading;
  }
};
