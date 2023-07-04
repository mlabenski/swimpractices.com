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
</style>

