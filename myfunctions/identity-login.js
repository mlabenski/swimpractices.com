const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://swimpractices-92836.firebaseio.com'
});

// Define your Cloud Firestore collection
const firestore = admin.firestore();
const usersCollection = firestore.collection('users');

exports.handler = async (event, context) => {
  if (event.body) {
    try {
      const eventData = JSON.parse(event.body);

      // Extract user data from the event
      const { username, email, uuid } = eventData;

      // Construct the user document data
      const userData = {
        username: username,
        email: email,
        user_id: uuid,
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

      // Save user data to Firestore
      await usersCollection.doc(uuid).set(userData);

      return {
        statusCode: 201,
        body: JSON.stringify({ message: "User document created successfully" })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to create user document", error: error.toString() })
      };
    }
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request body" })
    };
  }
};
