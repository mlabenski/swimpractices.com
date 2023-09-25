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
      <b-form-input v-model="editedUsername"></b-form-input>
      <b-button @click="saveUsername">Save</b-button>
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
      async saveUsername() {
      // Update Vuex Store
      this.$store.commit('auth/SET_USER', {
        ...this.user,
        username: this.editedUsername
      });
      
      // Update Netlify Identity
      const user = this.$netlifyIdentity.currentUser();
      await user.update({ data: { ...user.user_metadata, full_name: this.editedUsername } });
      
      // Exit editing mode
      this.editing = false;
    }
  },
  watch: {
  '$store.state.auth.user': {
    handler(newUser) {
      this.user = newUser;
      this.editedUsername = newUser ? newUser.username : '';
    },
    immediate: true
  }
}
};
</script>

<style scoped>
</style>
