<<template>
  <transition-group name="list" tag="div" class="fixed bottom-0 right-0 z-50">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="mb-4 mr-4 flex rounded-lg shadow-lg overflow-hidden animate-bounce"
      :class="getNotificationClass(notification.type)"
    >
      <div class="flex-1 p-4">
        <p class="font-semibold text-gray-800">{{ notification.message }}</p>
      </div>
      <button @click="removeNotification(notification)" class="text-white rounded-l-none rounded-r px-4">
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
  watch: {
    notifications: {
      deep: true,
      handler(newNotifications) {
        newNotifications.forEach(notification => {
          if (notification.duration) {
            setTimeout(() => {
              this.removeNotification(notification);
            }, notification.duration * 1000); // Convert seconds to milliseconds
          }
        });
      }
    }
  },
  methods: {
    removeNotification(notification) {
      this.$store.commit('notifications/REMOVE_NOTIFICATION', notification);
    },
    getNotificationClass(type) {
      switch(type) {
        case 1:
          return 'bg-red-500 hover:bg-red-600';
        case 2:
          return 'bg-green-500 hover:bg-green-600';
        case 3:
          return 'bg-yellow-500 hover:bg-yellow-600';
        default:
          return '';
      }
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

/* Adjustments for Notification Container */
.fixed.bottom-0.right-0 {
  padding-bottom: 15px;
  position: fixed;          /* Keeps the notification fixed during scrolling */
  bottom: 100px;             /* Distance from the bottom of the screen */
  right: 0;                 /* Reset right positioning */
  left: 0;                  /* Reset left positioning */
  display: flex;            /* Using flexbox to center the items */
  justify-content: center;  /* Centers the flex items on the horizontal line */
  z-index: 50;              /* Ensure it's above other content */
}
</style>

