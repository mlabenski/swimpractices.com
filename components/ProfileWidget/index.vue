<template>
  <b-card class="text-center">
    <!-- User Avatar -->
    <b-avatar size="128px" variant="primary" class="mb-2">
      <span class="material-icons" style="font-size: 64px;">person</span>
    </b-avatar>

    <!-- Username -->
    <h4 class="mb-0">{{ user.username }}</h4>

    <!-- Stats: Total Practices Created, Number of followers, Number of liked practices -->
    <div class="flex justify-center mt-3 space-x-4">
      <div>
        <span class="material-icons">create</span>
        <span>Created: {{ numPractices }}</span>
      </div>
      <div>
        <span class="material-icons">group</span>
        <span>Followers: {{ 2 }}</span>
      </div>
      <div>
        <span class="material-icons">thumb_up</span>
        <span>Likes: {{ 3 }}</span>
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
      numPractices: 0

    };
  },
  mounted() {
    this.user = this.$store.state.auth.user;
    this.numPractices = this.$store.state.practices.userPractices.length;
  }
};
</script>

<style scoped>
</style>
