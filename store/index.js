import { vuexfireMutations, firestoreAction } from 'vuexfire';

export const state = () => ({
  practices: [],
  userPractices: [],
});

export const mutations = {
  ...vuexfireMutations,
  SET_PRACTICES: (state, practices) => {
    state.practices = practices;
  },
  SET_USER_PRACTICES: (state, userPractices) => {
    state.userPractices = userPractices;
  }
};

export const actions = {
  bindPractices: firestoreAction(async function ({ bindFirestoreRef }) {
    console.log('test')
    const ref = this.$fire.firestore.collection('practices');
    await bindFirestoreRef('practices', ref, { wait: true });
  }),
  bindUserPractices: firestoreAction(async function ({ bindFirestoreRef, rootState }) {
    console.log('test')
    const userId = rootState.auth.user.id;
    const ref = this.$fire.firestore.collection('practices').where('userId', '==', userId);
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
  }
};
