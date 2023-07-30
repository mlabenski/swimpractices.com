<template>
  <b-card class="text-center">
    <!-- User Avatar -->
    <b-avatar size="96px" variant="primary" class="mb-2">
      <span class="material-icons" style="font-size: 48px;">person</span>
    </b-avatar>

    <!-- Username -->
    <h4 class="mb-0">{{ $store.state.user }}</h4>

    <!-- Total Practices Created -->
    <b-list-group flush class="mt-3">
      <b-list-group-item>
        <span class="material-icons">create</span> Practices Created: {{ $store.state.totalPractices }}
      </b-list-group-item>
      <!-- Number of followers -->
      <b-list-group-item>
        <span class="material-icons">group</span> Followers: {{ $store.state.followers }}
      </b-list-group-item>
      <!-- Number of liked practices -->
      <b-list-group-item>
        <span class="material-icons">thumb_up</span> Likes: {{ $store.state.likes }}
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>


<script>
export default {
  name: "ProfileWidget",
  data() {
    return {
      user: {},
    };
  },
  created() {
    this.user = this.$store.state.auth.user;
  },
};
</script>

<style scoped>
</style>
