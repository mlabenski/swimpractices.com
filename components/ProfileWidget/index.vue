<template>
  <b-card class="text-center sticky-card">
    <!-- User Avatar -->
    <b-avatar size="128px" variant="primary" class="mb-2">
      <span class="material-icons" style="font-size: 64px;">person</span>
    </b-avatar>

    <!-- Username -->
    <div class="mb-0 flex justify-between items-center">
      <h4>{{ user.username }}</h4>
      <b-button @click="editing = true">Edit</b-button>
    </div>
    <div v-if="editing" class="mb-0 flex justify-between items-center">
      <b-form-input v-model="editedUsername" class="text-black"></b-form-input>
      <b-button @click="updateUsername(editedUsername)" class="text-black">Save</b-button>
    </div>


    <!-- Stats: Total Practices Created, Number of followers, Number of liked practices -->
    <div class="flex justify-center mt-3 space-x-4">
      <div>
        <span class="material-icons">create</span>
        <span @click="filterUserPractices">Practices: {{ numPractices }}</span>
      </div>
      <div>
        <span class="material-icons">group</span>
        <span>Seasons: {{ 2 }}</span>
      </div>
      <div>
        <span class="material-icons">thumb_up</span>
        <span>Liked Practices: {{ 3 }}</span>
      </div>
    </div>
    <!-- User Practices Message -->
    <div class="user-practices-message" v-if="userPracticeOpen">
      <span>User Practices</span>
    </div>
  </b-card>
</template>


<script>
export default {
  name: "ProfileWidget",
  data() {
    return {
      user: {},
      numPractices: 0,
      editing: false,
      editedUsername: '',
      userPracticeOpen: false,
    };
  },
  mounted() {
    this.user = this.$store.state.auth.user;
    this.numPractices = this.$store.state.practices.userPractices.length;
  },
  beforeDestroy() {
    this.$store.dispatch('practices/clearFilteredPractices');
  },
  methods: {
    async updateUsername(newUsername) {
    if (!this.user.id) {
      alert('Not signed in');
      return;
    }

    try {
      // Reference to the user's document in the Firestore "users" collection
      const userDocRef = this.$fire.firestore.collection('users').doc(this.user.id);

      // Fetch the user document
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        // Update the username in the user's document if it exists
        await userDocRef.update({
          username: newUsername
        });
      } else {
        // Create a new document with the given user ID and username if it doesn't exist
        await userDocRef.set({
          id: this.user.id,
          username: newUsername,
          // set other initial fields as needed
        });
      }

      alert('Username updated successfully');
    } catch (error) {
      console.error('Failed to update username', error);
      alert('Failed to update username');
    }
  },
    filterUserPractices() {
      // Toggle the state of userPracticeOpen
      this.userPracticeOpen = !this.userPracticeOpen;

      if (this.userPracticeOpen) {
        // If userPracticeOpen is now true, clear the filtered practices
        this.$store.dispatch('practices/clearFilteredPractices');
      } else {
        // If userPracticeOpen is now false, filter practices by the user
        this.$store.dispatch('practices/filterPracticesByUser');
      }
    }
},
};
</script>

<style scoped>
.sticky-card {
  position: sticky;
  top: 0; /* Adjust this value based on your specific header/nav height */
  z-index: 1000; /* Ensures the card stays on top */
  background-color: white; /* Optional: for better visibility against other content */
}

.user-practices-message {
  margin-top: 20px;
  padding: 10px;
  font-size: 16px;
  color: #333;
  background-color: #f9f9f9; /* Light grey background */
  border-top: 1px solid #ddd; /* Adds a subtle separation line */
}
</style>
