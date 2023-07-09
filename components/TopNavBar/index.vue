<template>
  <!-- Top navigation bar -->
  <nav class="fixed top-0 w-full bg-gray-900 text-white px-2 py-1 z-200">
    <div class="container mx-auto">
      <div class="flex justify-between text-xs">
        <!-- Create practice button -->
        <a href="#" class="flex flex-col items-center space-y-1" @click.prevent="startPractice" v-if="user">
          <span class="material-icons w-5 h-5 fill-current">school</span>
          <span>Create</span>
        </a>

        <!-- View practice button -->
        <a href="#" class="flex flex-col items-center space-y-1">
          <span class="material-icons w-5 h-5 fill-current">pool</span>
          <span>View</span>
        </a>

        <!-- Login / Logout button -->
        <a href="#" class="flex flex-col items-center space-y-1" @click.prevent="openSignup" v-if="!user">
          <span class="material-icons w-5 h-5 fill-current">lock_open</span>
          <span>Log In</span>
        </a>
        <a href="#" class="flex flex-col items-center space-y-1" @click.prevent="logout" v-if="user">
          <span class="material-icons w-5 h-5 fill-current">lock_open</span>
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
