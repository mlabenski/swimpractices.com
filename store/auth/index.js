export const ACTION_KEY_LOGIN = "login"
export const ACTION_KEY_SIGNUP = "signup"

export const state = () => ({
  user: null,
  firebaseToken: null,
  firebaseUser: null,
  authModalOpen: false,
})

export const getters = {
  user: (state) => state.user,
  firebaseToken: (state) => state.firebaseToken,
  firebaseUser: (state) => state.firebaseUser,
  isFirebaseAuthenticated: (state) => !!state.firebaseUser,
  authModalOpen: (state) => state.authModalOpen,
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
  },
  SET_AUTH_MODAL_OPEN(state, open) {
    state.authModalOpen = open
  },
}

export const actions = {
  /**
   * Initialize auth: subscribe to Firebase Auth state as the single source of truth.
   * Netlify Identity is still initialized for backward compatibility but no longer drives state.user.
   */
  async init({ commit, dispatch }) {
    if (typeof window === "undefined" || !this.$fire?.auth) {
      return
    }

    this.$fire.auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        commit("SET_USER", {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          username: firebaseUser.displayName || firebaseUser.email || "User",
          role: firebaseUser.role || null,
          uuid: firebaseUser.uid,
        })
        commit("SET_FIREBASE_USER", firebaseUser)
        try {
          const token = await firebaseUser.getIdToken()
          commit("SET_FIREBASE_TOKEN", token)
        } catch (e) {
          console.error("Error getting Firebase ID token:", e)
        }
        await dispatch("ensureUserDocument", firebaseUser)
      } else {
        commit("SET_USER", null)
        commit("SET_FIREBASE_TOKEN", null)
        commit("SET_FIREBASE_USER", null)
      }
    })

    if (this.$netlifyIdentity) {
      this.$netlifyIdentity.init({
        APIUrl: "https://swimpractices.netlify.app/.netlify/identity",
      })
    }
  },

  /**
   * Ensure users/{firebaseUid} exists in Firestore (same shape as iOS/backend).
   * Called after Firebase Auth sign-in. Creates doc via Cloud Function if missing.
   */
  async ensureUserDocument({ state }, firebaseUser) {
    if (!this.$fire?.firestore || !firebaseUser?.uid) {
      return
    }
    const userRef = this.$fire.firestore.collection("users").doc(firebaseUser.uid)
    try {
      const doc = await userRef.get()
      if (!doc.exists) {
        await this.$axios.post(
          "https://us-central1-swimpractices-92836.cloudfunctions.net/createUserDocument",
          {
            uuid: firebaseUser.uid,
            username: firebaseUser.displayName || firebaseUser.email || "User",
            email: firebaseUser.email || "",
          }
        )
        const publicRef = this.$fire.firestore.collection("users_public").doc(firebaseUser.uid)
        const privateRef = this.$fire.firestore.collection("users_private").doc(firebaseUser.uid)
        const publicData = {
          user_id: firebaseUser.uid,
          username: firebaseUser.displayName || firebaseUser.email || "User",
          selectedAge: 18,
          selectedExperience: 2,
          intervals: {
            "100 free": { distance: 100, interval: 80, poolLength: "25 yards" },
            "100 backstroke": { distance: 100, interval: 80, poolLength: "25 yards" },
            "100 butterfly": { distance: 100, interval: 80, poolLength: "25 yards" },
            "100 breaststroke": { distance: 100, interval: 80, poolLength: "25 yards" },
            "100 individual medley": { distance: 100, interval: 80, poolLength: "25 yards" },
          },
        }
        const privateData = {
          user_id: firebaseUser.uid,
          external_ids: { firebase: firebaseUser.uid },
          email: firebaseUser.email || "",
          pinnedPractices: [],
          practices: [],
        }
        await Promise.all([
          publicRef.set(publicData),
          privateRef.set(privateData),
        ])
        console.log("User documents created for Firebase UID:", firebaseUser.uid)
      }
    } catch (error) {
      console.error("Error ensuring user document:", error)
    }
  },

  openSignup({ commit }) {
    commit("SET_AUTH_MODAL_OPEN", true)
  },

  openLogin({ commit }) {
    commit("SET_AUTH_MODAL_OPEN", true)
  },

  closeAuthModal({ commit }) {
    commit("SET_AUTH_MODAL_OPEN", false)
  },

  async logout({ commit }) {
    try {
      await this.$firebaseAuth.signOut()
    } catch (error) {
      console.error("Error signing out from Firebase:", error)
    }
    try {
      if (this.$netlifyIdentity) {
        this.$netlifyIdentity.logout()
      }
    } catch (e) {
      // Netlify optional
    }
    commit("SET_USER", null)
    commit("SET_FIREBASE_TOKEN", null)
    commit("SET_FIREBASE_USER", null)
  },

  /**
   * Sign in with Google (Firebase Auth). onAuthStateChanged will then set state.user and ensure user doc.
   */
  async signInWithGoogle({ commit }) {
    try {
      await this.$firebaseAuth.signInWithGoogle()
      commit("SET_AUTH_MODAL_OPEN", false)
    } catch (error) {
      console.error("Error signing in with Google:", error)
      throw error
    }
  },

  /**
   * Sign in with email/password (Firebase Auth).
   */
  async signInWithEmail({ commit }, { email, password }) {
    try {
      await this.$firebaseAuth.signInWithEmail(email, password)
      commit("SET_AUTH_MODAL_OPEN", false)
    } catch (error) {
      console.error("Error signing in with email:", error)
      throw error
    }
  },

  /**
   * Create account with email/password (Firebase Auth).
   */
  async signUpWithEmail({ commit }, { email, password, displayName }) {
    try {
      await this.$firebaseAuth.createUserWithEmail(email, password, displayName)
      commit("SET_AUTH_MODAL_OPEN", false)
    } catch (error) {
      console.error("Error signing up with email:", error)
      throw error
    }
  },
}
