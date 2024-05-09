<template>
  <div v-if="pendingPracticeExists" class="notification" @click="navigateToPractice">
    You have a pending practice. Click here to navigate back.
  </div>
</template>

<script>
export default {
  name: 'PendingPracticeNotification',
  data() {
    return {
      pendingPracticeExists: false,
      practiceId: null
    };
  },
  methods: {
    checkPendingPractice() {
      const practiceId = localStorage.getItem('pendingPractice');
      if (practiceId) {
        this.pendingPracticeExists = true;
        this.practiceId = practiceId;
        console.log('Pending practice id:', this.practiceId);
      } else {
        this.pendingPracticeExists = false;
        this.practiceId = null;
      }
    },
    navigateToPractice() {
      if (this.practiceId) {
        // Using Vue Router to navigate
        this.$router.push(`/practice/${this.practiceId}`);
      } else {
        console.error('No practice ID found for navigation.');
      }
    }
  },
  mounted() {
    this.checkPendingPractice();
  }
}
</script>

<style>
.notification {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background-color: #007BFF;  /* Primary blue */
  color: white;
  border-radius: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  cursor: pointer;
  z-index: 1500;  /* Ensures visibility over other content */
  transition: background-color 0.3s ease;
}

.notification:hover {
  background-color: #0056b3;  /* Darker blue on hover */
}
</style>
