# Web App Authentication Guide

## Overview

The web application uses a **hybrid authentication system** that bridges Netlify Identity with Firebase Authentication. This allows you to keep your existing Netlify Identity UI while satisfying Firebase Firestore security rules.

## Why This Architecture?

Your Firestore security rules require `request.auth != null` to access data. However, Netlify Identity tokens are not recognized by Firebase. This implementation solves that by:

1. ✅ Keeping Netlify Identity for user management
2. ✅ Creating Firebase custom tokens for Firestore access
3. ✅ Seamless user experience (no extra login steps)
4. ✅ Secure access to Cloud Functions

## Authentication Flow

```
User Action: Click "Login"
   ↓
1. Netlify Identity modal opens
   User enters credentials
   ↓
2. Netlify authenticates user
   Returns Netlify JWT token
   ↓
3. Frontend calls authenticateWithFirebase()
   ↓
4. Frontend calls Cloud Function: createFirebaseToken
   Sends: { netlifyToken, uid }
   ↓
5. Cloud Function creates Firebase custom token
   Returns: { firebaseToken, uid }
   ↓
6. Frontend signs into Firebase Auth
   using customToken
   ↓
7. Firebase SDK now includes auth context
   in all Firestore requests
   ↓
8. Firestore security rules pass
   ✅ Data access granted
```

## Code Architecture

### Store: `store/auth/index.js`

**State:**
```javascript
{
  user: {              // Netlify Identity user
    username: string,
    email: string,
    id: string,
    uuid: string
  },
  firebaseToken: string,    // Firebase ID token
  firebaseUser: Object      // Firebase Auth user
}
```

**Key Actions:**

1. **`init()`** - Initialize authentication
   - Sets up Netlify Identity listeners
   - Automatically calls `authenticateWithFirebase()` on login

2. **`authenticateWithFirebase(netlifyUser)`** - Bridge to Firebase
   - Calls `getFirebaseToken()` to exchange tokens
   - Signs into Firebase Auth with custom token
   - Saves user data to Firestore

3. **`getFirebaseToken(netlifyUser)`** - Exchange tokens
   - POST to `createFirebaseToken` Cloud Function
   - Returns Firebase custom token

4. **`logout()`** - Sign out
   - Signs out from both Netlify and Firebase

### Plugin: `plugins/firebase-auth-helper.js`

Utility methods available as `this.$firebaseAuth`:

```javascript
// Get current Firebase ID token
const token = await this.$firebaseAuth.getIdToken()

// Sign in with custom token
await this.$firebaseAuth.signInWithCustomToken(customToken)

// Check if signed in
const isSignedIn = this.$firebaseAuth.isSignedIn()

// Get current user
const user = this.$firebaseAuth.getCurrentUser()

// Sign out
await this.$firebaseAuth.signOut()
```

### Config: `nuxt.config.js`

Firebase configuration with auth enabled:

```javascript
firebase: {
  config: {
    apiKey: process.env.VUE_APP_FIREBASE_apiKey,
    authDomain: process.env.VUE_APP_FIREBASE_authDomain,
    projectId: process.env.VUE_APP_FIREBASE_projectId,
    // ...
  },
  services: {
    auth: true,        // ✅ Firebase Auth enabled
    firestore: true
  }
}
```

## Using Authentication in Components

### Accessing User State

```javascript
// In component
export default {
  computed: {
    ...mapGetters('auth', [
      'user',                    // Netlify user
      'firebaseUser',           // Firebase user
      'firebaseToken',          // Firebase ID token
      'isFirebaseAuthenticated' // Boolean
    ])
  }
}
```

### Making Authenticated Requests

#### Firestore Operations (Automatic)

```javascript
// All Firestore operations work automatically
// No need to manually add auth headers!

// Read
const practices = await this.$fire.firestore
  .collection('practices')
  .get()

// Write
await this.$fire.firestore
  .collection('users')
  .doc(this.user.id)
  .set(userData)
```

#### HTTP Cloud Functions (Manual Headers)

If you call Cloud Functions directly via axios:

```javascript
// Get Firebase ID token
const token = await this.$firebaseAuth.getIdToken()

// Call Cloud Function with auth header
const response = await this.$axios.post(
  'https://us-central1-swimpractices-92836.cloudfunctions.net/generateSwimPractice',
  {
    userId: this.user.id,
    practiceCount: 5
  },
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
)
```

## Common Scenarios

### Check if User is Authenticated

```javascript
// Method 1: Check Netlify auth
if (this.$store.state.auth.user) {
  // User logged in with Netlify
}

// Method 2: Check Firebase auth
if (this.$store.getters['auth/isFirebaseAuthenticated']) {
  // User authenticated with Firebase
}

// Method 3: Check both
if (this.user && this.firebaseUser) {
  // Fully authenticated on both systems
}
```

### Handling Authentication Errors

```javascript
methods: {
  async loadUserData() {
    try {
      // Attempt Firestore operation
      const doc = await this.$fire.firestore
        .collection('users')
        .doc(this.user.id)
        .get()

      if (doc.exists) {
        this.userData = doc.data()
      }
    } catch (error) {
      if (error.code === 'permission-denied') {
        console.error('User not authenticated with Firebase')
        // Retry authentication
        await this.$store.dispatch('auth/authenticateWithFirebase', this.user)
      } else {
        console.error('Error loading user data:', error)
      }
    }
  }
}
```

### Force Token Refresh

```javascript
// If token expired or invalid, refresh it
methods: {
  async refreshAuth() {
    const netlifyUser = this.$netlifyIdentity.currentUser()
    if (netlifyUser) {
      await this.$store.dispatch('auth/authenticateWithFirebase', netlifyUser)
      console.log('Authentication refreshed')
    }
  }
}
```

## Debugging

### Check Authentication Status

Open browser console and run:

```javascript
// Check Netlify auth
netlifyIdentity.currentUser()

// Check Firebase auth
firebase.auth().currentUser

// Check Vuex state
$nuxt.$store.state.auth
```

### Common Console Messages

✅ **Success Flow:**
```
"Starting Firebase authentication flow..."
"Successfully obtained Firebase custom token"
"Firebase authentication complete"
"User document created successfully."
```

❌ **Error Messages:**

1. **"Error getting Firebase token"**
   - Cloud Function failed
   - Check: Function deployed? Network connectivity?

2. **"Error signing in with custom token"**
   - Invalid custom token
   - Check: Firebase Auth enabled? Correct project?

3. **"Error accessing Firestore: Missing or insufficient permissions"**
   - Firebase auth didn't complete
   - Check: `authenticateWithFirebase()` was called?

4. **"Unauthorized: Invalid or missing authentication token"**
   - Calling Cloud Function without auth header
   - Check: Added `Authorization: Bearer <token>` header?

## Environment Variables

Required in `.env` file:

```bash
VUE_APP_FIREBASE_apiKey=your-api-key
VUE_APP_FIREBASE_authDomain=your-project.firebaseapp.com
VUE_APP_FIREBASE_projectId=your-project-id
VUE_APP_FIREBASE_storageBucket=your-project.appspot.com
VUE_APP_FIREBASE_messagingSenderId=123456789
VUE_APP_FIREBASE_appId=1:123456789:web:abcdef
VUE_APP_FIREBASE_measurementd=G-XXXXXXXXX
```

## Security Considerations

### ✅ DO

- Let Firebase SDK manage tokens (stored in memory)
- Use `this.$firebaseAuth.getIdToken()` to get fresh tokens
- Sign out from both Netlify and Firebase on logout
- Validate all user inputs before sending to Cloud Functions

### ❌ DON'T

- Store Firebase tokens in localStorage (security risk)
- Share tokens between users
- Bypass authentication for "convenience"
- Hardcode Firebase config in client code (use env vars)
- Disable Firebase Auth in production

## Testing

### Local Development

1. Start dev server: `npm run dev`
2. Open browser: `http://localhost:3000`
3. Click "Login" → Netlify Identity modal opens
4. Sign in with test account
5. Check console for authentication flow logs
6. Verify practices load without permission errors

### Production Testing

1. Deploy to Netlify: `git push origin main`
2. Open deployed site
3. Test login flow
4. Check browser console for errors
5. Verify all Firestore operations work

## Troubleshooting

### "firebase is not defined" Error

**Cause:** Firebase not initialized

**Solution:** Ensure `@nuxtjs/firebase` is installed and configured in `nuxt.config.js`

### "this.$firebaseAuth is not defined"

**Cause:** Plugin not loaded

**Solution:** Check that `plugins/firebase-auth-helper.js` is listed in `nuxt.config.js`

### Token Expired Errors

**Cause:** Firebase ID token expired (1 hour lifetime)

**Solution:** Firebase SDK auto-refreshes. If manual call needed:

```javascript
const token = await this.$fire.auth.currentUser.getIdToken(true) // force refresh
```

## Migration Notes

If you're updating an existing deployment:

1. ✅ Existing users continue to work (Netlify Identity unchanged)
2. ✅ First login after update will establish Firebase auth
3. ✅ No data loss or migration needed
4. ⚠️ Cloud Functions must be deployed before frontend
5. ⚠️ Clear browser cache if authentication issues persist

## Support

For issues or questions:

1. Check browser console for error messages
2. Check Firebase Console → Authentication for user status
3. Check Firebase Console → Functions → Logs
4. Review `store/auth/index.js` for action errors
5. Contact development team with error logs
