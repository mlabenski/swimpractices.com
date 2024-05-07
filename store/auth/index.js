import axios from "axios";

export const ACTION_KEY_LOGIN = 'login'
export const ACTION_KEY_SIGNUP = 'signup'

export const state = () => ({
  user: null
})

export const getters = {
  user: (state) => state.user
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  }
}

export const actions = {
  init({ commit, dispatch }) {
    this.$netlifyIdentity.on('init', (user) => {
      if (user) {
        dispatch('saveUserData', user)
        commit('SET_USER', {
          username: user.user_metadata.full_name,
          email: user.email,
          role: user.app_metadata.roles,
          id: user.id,
          token: user.token,
          uuid: user.user_metadata.uuid
        })
      }
    })
    this.$netlifyIdentity.on('close', () => {
      const user = this.$netlifyIdentity.currentUser()
      if (user) {
        dispatch('saveUserData', user)
        commit('SET_USER', {
          username: user.user_metadata.full_name,
          email: user.email,
          role: user.app_metadata.roles,
          id: user.id,
          uuid: user.user_metadata.uuid
        })
      }
    })
    this.$netlifyIdentity.init({
      APIUrl: 'https://swimpractices.netlify.app/.netlify/identity'
    })
  },
  openSignup({ dispatch }) {
    dispatch('open', ACTION_KEY_SIGNUP)
  },
  openLogin({ dispatch }) {
    dispatch('open', ACTION_KEY_LOGIN)
  },
  logout({ commit }) {
    this.$netlifyIdentity.logout()
    commit('SET_USER', null)
  },
  open({ commit, dispatch }, action) {
    this.$netlifyIdentity.open(action)
    this.$netlifyIdentity.on(action, async (user) => {
      commit('SET_USER', {
        username: user.user_metadata.full_name,
        email: user.email,
        role: user.app_metadata.roles,
        id: user.id,
        uuid: user.user_metadata.uuid
      })
      this.$netlifyIdentity.close()
    })
  },
  async saveUserData({ commit }, user) {
    console.log('made it into save user data')
    const userData = {
      external_ids: {"netlify": user.id},
      username: user.user_metadata.full_name,
      email: user.email,
      user_id: user.id,
      intervals: {
        "100 free": { distance: 100, interval: 80, poolLength: "25 yards" },
        "100 backstroke": { distance: 100, interval: 80, poolLength: "25 yards" },
        "100 butterfly": { distance: 100, interval: 80, poolLength: "25 yards" },
        "100 breaststroke": { distance: 100, interval: 80, poolLength: "25 yards" },
        "100 individual medley": { distance: 100, interval: 80, poolLength: "25 yards" }
      },
      selectedAge: 18,
      selectedExperience: 2
    };

    const userRef = this.$fire.firestore.collection('users').doc(user.id);

    try {
      const doc = await userRef.get();
      if (!doc.exists) {
        await userRef.set(userData);
        console.log("User document created successfully.");
        // Optionally commit to Vuex state if needed
        // commit('SET_USER_DATA', userData);
      } else {
        console.log("User already exists.");
      }
    } catch (error) {
      console.error('Error accessing Firestore:', error);
    }
  }
}
