<template>
  <b-card class="text-center">
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
        <span>Practices: {{ numPractices }}</span>
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
      editedUsername: ''
    };
  },
  mounted() {
    this.user = this.$store.state.auth.user;
    this.numPractices = this.$store.state.practices.userPractices.length;
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
          userID: this.userID,
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
},
};
</script>

<style scoped>
</style>
