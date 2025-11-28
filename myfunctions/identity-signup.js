const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (e) {
    console.error('Firebase admin initialization error', e);
  }
}

exports.handler = async (event) => {
  const { user } = JSON.parse(event.body);
  const db = admin.firestore();
  
  // Assuming the Netlify user ID is used as the Firebase UID
  const userId = user.id; 

  const newUser = {
    userId: userId,
    username: (user.user_metadata && user.user_metadata.full_name) || "Unknown User",
    email: user.email || "No email provided",
    externalIds: {
      // The 'sub' field from the JWT should contain the provider's user ID
      apple: user.sub || null, 
      firebase: userId,
    },
    selectedAge: 18,
    selectedExperience: 2,
    intervalProgression: false,
    poolLapLength: 25.0,
    poolLapUnit: "meters",
    poolLocationType: "outdoor",
    swimmingLocationType: "pool",
    favoritedPracticeIds: [],
    intervals: {
      "100 free": { distance: 100, interval: 80, poolLength: "25 yards" },
      "100 backstroke": { distance: 100, interval: 80, poolLength: "25 yards" },
      "100 butterfly": { distance: 100, interval: 80, poolLength: "25 yards" },
      "100 breaststroke": { distance: 100, interval: 80, poolLength: "25 yards" },
      "100 individual medley": { distance: 100, interval: 80, poolLength: "25 yards" },
    },
  };

  try {
    await db.collection('users').doc(userId).set(newUser);
    console.log('Successfully created user document in Firestore for user:', userId);
  } catch (error) {
    console.error('Error creating user document in Firestore:', error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      app_metadata: {
        roles: ['free']
      },
      user_metadata: {
        ...user.user_metadata,
      }
    }),
  };
};