<template>
  <transition-group name="list" tag="div" class="fixed bottom-0 right-0 z-50">
    <div v-for="notification in notifications" :key="notification.id" class="mb-4 mr-4 flex bg-white rounded-lg shadow-lg overflow-hidden animate-bounce">
      <div class="flex-1 p-4">
        <p class="font-semibold text-gray-800">{{ notification.message }}</p>
      </div>
      <button @click="removeNotification(notification)" class="text-white bg-red-500 hover:bg-red-600 rounded-l-none rounded-r px-4">
        <span class="material-icons">
          close
        </span>
      </button>
    </div>
  </transition-group>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('notifications', {
      notifications: state => state.notifications
    })
  },
  methods: {
    removeNotification(notification) {
      this.$store.commit('notifications/REMOVE_NOTIFICATION', notification);
    }
  }
}
</script>

<style scoped>
.list-enter-active, .list-leave-active {
  transition: all .5s ease;
}
.list-enter, .list-leave-to {
  transform: translateY(100px);
  opacity: 0;
}
</style>
