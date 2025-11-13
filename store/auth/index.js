export const ACTION_KEY_LOGIN = 'login'
export const ACTION_KEY_SIGNUP = 'signup'

export const state = () => ({
  user: null,
  firebaseToken: null,
  firebaseUser: null
})

export const getters = {
  user: (state) => state.user,
  firebaseToken: (state) => state.firebaseToken,
  firebaseUser: (state) => state.firebaseUser,
  isFirebaseAuthenticated: (state) => !!state.firebaseUser
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_FIREBASE_TOKEN(state, token) {
    state.firebaseToken = token
  },
  SET_FIREBASE_USER(state, user) {
    state.firebaseUser = user
  }
}

export const actions = {
  async init({ commit, dispatch }) {
    this.$netlifyIdentity.on('init', async (user) => {
      if (user) {
        commit('SET_USER', {
          username: user.user_metadata.full_name,
          email: user.email,
          role: user.app_metadata.roles,
          id: user.id,
          token: user.token,
          uuid: user.user_metadata.uuid
        })
        // Authenticate with Firebase after Netlify auth
        await dispatch('authenticateWithFirebase', user)
      }
    })
    this.$netlifyIdentity.on('close', async () => {
      const user = this.$netlifyIdentity.currentUser()
      if (user) {
        commit('SET_USER', {
          username: user.user_metadata.full_name,
          email: user.email,
          role: user.app_metadata.roles,
          id: user.id,
          uuid: user.user_metadata.uuid
        })
        // Authenticate with Firebase after Netlify auth
        await dispatch('authenticateWithFirebase', user)
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
  async logout({ commit }) {
    this.$netlifyIdentity.logout()
    // Sign out from Firebase Auth as well
    try {
      await this.$firebaseAuth.signOut()
    } catch (error) {
      console.error('Error signing out from Firebase:', error)
    }
    commit('SET_USER', null)
    commit('SET_FIREBASE_TOKEN', null)
    commit('SET_FIREBASE_USER', null)
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

    // Split user data into public and private
    const publicData = {
      user_id: user.id,
      username: user.user_metadata.full_name,
      selectedAge: 18,
      selectedExperience: 2,
      intervals: {
        "100 free": { distance: 100, interval: 80, poolLength: "25 yards" },
        "100 backstroke": { distance: 100, interval: 80, poolLength: "25 yards" },
        "100 butterfly": { distance: 100, interval: 80, poolLength: "25 yards" },
        "100 breaststroke": { distance: 100, interval: 80, poolLength: "25 yards" },
        "100 individual medley": { distance: 100, interval: 80, poolLength: "25 yards" }
      }
    };

    const privateData = {
      user_id: user.id,
      external_ids: {"netlify": user.id},
      email: user.email,
      pinnedPractices: [],
      practices: []
    };

    // Legacy: Keep writing to old 'users' collection for backward compatibility
    const legacyUserData = {
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
    const publicRef = this.$fire.firestore.collection('users_public').doc(user.id);
    const privateRef = this.$fire.firestore.collection('users_private').doc(user.id);

    try {
      const doc = await userRef.get();
      if (!doc.exists) {
        // Create all three documents (legacy + new structure)
        await Promise.all([
          userRef.set(legacyUserData),
          publicRef.set(publicData),
          privateRef.set(privateData)
        ]);
        console.log("User documents created successfully (legacy + public/private split).");
      } else {
        console.log("User already exists.");
      }
    } catch (error) {
      console.error('Error accessing Firestore:', error);
    }
  },

  /**
   * Get Firebase custom token from Cloud Function
   * Exchanges Netlify Identity token for Firebase custom token
   */
  async getFirebaseToken({ commit }, netlifyUser) {
    try {
      const response = await this.$axios.post(
        'https://us-central1-swimpractices-92836.cloudfunctions.net/createFirebaseToken',
        {
          netlifyToken: netlifyUser.token.access_token,
          uid: netlifyUser.id
        }
      )

      if (response.data && response.data.firebaseToken) {
        console.log('Successfully obtained Firebase custom token')
        return response.data.firebaseToken
      } else {
        throw new Error('Invalid response from token endpoint')
      }
    } catch (error) {
      console.error('Error getting Firebase token:', error)
      throw error
    }
  },

  /**
   * Authenticate with Firebase using custom token
   * This is called after Netlify Identity authentication succeeds
   */
  async authenticateWithFirebase({ commit, dispatch }, netlifyUser) {
    try {
      console.log('Starting Firebase authentication flow...')

      // Get Firebase custom token from our Cloud Function
      const customToken = await dispatch('getFirebaseToken', netlifyUser)

      // Sign in to Firebase Auth with the custom token
      const userCredential = await this.$firebaseAuth.signInWithCustomToken(customToken)

      // Get the Firebase ID token (this is what we send to secure endpoints)
      const idToken = await userCredential.user.getIdToken()

      // Store Firebase user and token in state
      commit('SET_FIREBASE_USER', userCredential.user)
      commit('SET_FIREBASE_TOKEN', idToken)

      console.log('Firebase authentication complete')

      // Now that we're authenticated with Firebase, save user data to Firestore
      await dispatch('saveUserData', netlifyUser)

    } catch (error) {
      console.error('Error authenticating with Firebase:', error)
      // Don't throw - allow the app to continue with Netlify auth even if Firebase fails
      // This provides a graceful degradation
    }
  }
}
