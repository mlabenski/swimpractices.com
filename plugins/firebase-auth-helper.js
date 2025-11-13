/**
 * Firebase Auth Helper Plugin
 * Provides utilities for managing Firebase authentication tokens
 */

export default ({ app, store }, inject) => {
  const firebaseAuth = {
    /**
     * Get the current Firebase ID token
     * @returns {Promise<string|null>} The ID token or null if not authenticated
     */
    async getIdToken() {
      try {
        const currentUser = app.$fire.auth.currentUser
        if (!currentUser) {
          console.warn('No Firebase user currently signed in')
          return null
        }

        // Force refresh if token is about to expire (within 5 minutes)
        const forceRefresh = false
        const idToken = await currentUser.getIdToken(forceRefresh)
        return idToken
      } catch (error) {
        console.error('Error getting Firebase ID token:', error)
        return null
      }
    },

    /**
     * Sign in to Firebase using a custom token
     * @param {string} customToken - The Firebase custom token
     * @returns {Promise<Object>} The user credential
     */
    async signInWithCustomToken(customToken) {
      try {
        const userCredential = await app.$fire.auth.signInWithCustomToken(customToken)
        console.log('Successfully signed in to Firebase Auth')
        return userCredential
      } catch (error) {
        console.error('Error signing in with custom token:', error)
        throw error
      }
    },

    /**
     * Sign out from Firebase Auth
     * @returns {Promise<void>}
     */
    async signOut() {
      try {
        await app.$fire.auth.signOut()
        console.log('Successfully signed out from Firebase Auth')
      } catch (error) {
        console.error('Error signing out from Firebase:', error)
        throw error
      }
    },

    /**
     * Check if user is signed in to Firebase Auth
     * @returns {boolean}
     */
    isSignedIn() {
      return app.$fire.auth.currentUser !== null
    },

    /**
     * Get current Firebase user
     * @returns {Object|null}
     */
    getCurrentUser() {
      return app.$fire.auth.currentUser
    }
  }

  // Inject into context as $firebaseAuth
  inject('firebaseAuth', firebaseAuth)
}
