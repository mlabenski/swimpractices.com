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
  init({ commit }) {
    this.$netlifyIdentity.on('init', (user) => {
      if (user) {
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
  open({ commit }, action) {
    this.$netlifyIdentity.open(action)
    this.$netlifyIdentity.on(action, (user) => {
      commit('SET_USER', {
        username: user.user_metadata.full_name,
        email: user.email,
        role: user.app_metadata.roles,
        id: user.id,
        uuid: user.user_metadata.uuid
      })
      this.$netlifyIdentity.close()
    })
  }
}
