<template>
  <div class="notifications">
    <div v-for="notification in notifications" :key="notification.id" class="notification">
      {{ notification.message }}
      <button @click="removeNotification(notification)">Dismiss</button>
    </div>
  </div>
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
