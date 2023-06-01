import { vuexfireMutations, firestoreAction } from 'vuexfire';

export const state = () => ({
  practices: [],
});

export const mutations = {
  ...vuexfireMutations,
  SET_PRACTICES: (state, practices) => {
    state.practices = practices;
  },
};

export const actions = {
  bindPractices: firestoreAction(async function ({ bindFirestoreRef }) {
    console.log('test')
    const ref = this.$fire.firestore.collection('practices');
    await bindFirestoreRef('practices', ref, { wait: true });
  }),
  unbindPractices: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef('practices', false);
  }),
};

export const getters = {
  practices(state) {
    return state.practices;
  },
};
