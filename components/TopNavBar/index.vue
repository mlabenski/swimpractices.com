<template>
  <!-- Top navigation bar -->
  <nav class="fixed bottom-0 w-full bg-gray-900 text-white px-2 py-1 z-200">
    <div class="container mx-auto">
      <div class="flex justify-between items-center text-xs">
        <!-- Create practice button -->
        <a href="#" class="flex flex-col items-center space-y-1 pt-1 pb-2" @click.prevent="startPractice" v-if="user">
          <span class="material-icons w-6 h-6 fill-current">school</span>
          <span>Create</span>
        </a>

        <!-- View practice button -->
        <a href="#" class="flex flex-col items-center space-y-1 pt-1 pb-2">
          <span class="material-icons w-6 h-6 fill-current">pool</span>
          <span>View</span>
        </a>

        <!-- Help button -->
        <a href="#" class="flex flex-col items-center space-y-1 pt-1 pb-2" v-if="!user">
          <span class="material-icons w-6 h-6 fill-current">help</span>
          <span>Help</span>
        </a>

        <!-- Rankings button -->
        <a href="#" class="flex flex-col items-center space-y-1 pt-1 pb-2" v-if="!user">
          <span class="material-icons w-6 h-6 fill-current">leaderboard</span>
          <span>Rankings</span>
        </a>

        <!-- Login / Logout button -->
        <a href="#" class="flex flex-col items-center space-y-1 pt-1 pb-2" @click.prevent="openSignup" v-if="!user">
          <span class="material-icons w-6 h-6 fill-current">lock_open</span>
          <span>Log In</span>
        </a>
        <a href="#" class="flex flex-col items-center space-y-1 pt-1 pb-2" @click.prevent="logout" v-if="user">
          <span class="material-icons w-6 h-6 fill-current">lock_open</span>
          <span>Log Out</span>
        </a>
      </div>
    </div>
  </nav>
</template>




<script>
export default {
  head () {
    return {
      link: [
        // Add this
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
      ],
    }
  },
  name: 'TopNavBar',
  props: ['user'],
  methods: {
    startPractice() {
      this.$emit('startPractice');
    },
    openSignup() {
      this.$emit('openSignup');
    },
    logout() {
      this.$emit('logout');
    },
  },
}
</script>
