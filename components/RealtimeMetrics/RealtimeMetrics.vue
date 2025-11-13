<template>
  <div class="realtime-metrics p-6 rounded-lg bg-gray-800 shadow-lg text-white text-center">
    <div class="flex justify-around items-center">
      <div class="metric-item">
        <div class="text-4xl font-bold text-green-400">
          <span ref="currentPractices">0</span>
        </div>
        <div class="text-sm uppercase tracking-wider text-gray-400">
          <span class="pulsing-dot"></span>
          Practices Now
        </div>
      </div>
      <div class="metric-item">
        <div class="text-lg font-semibold">{{ mostRecentTimeAgo }}</div>
        <div class="text-sm uppercase tracking-wider text-gray-400">Most Recent</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    metrics: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      mostRecentTimeAgo: '',
      intervalId: null,
      animationIntervalId: null,
    };
  },
  computed: {
    min() {
      return this.metrics.hour_count_min;
    },
    max() {
      return this.metrics.hour_count_max;
    },
    mostRecent() {
      // The timestamp from firestore needs to be converted to a Date object
      return this.metrics.most_recent.toDate();
    }
  },
  mounted() {
    this.updateTimeAgo();
    this.intervalId = setInterval(this.updateTimeAgo, 60000); // Update every minute
    this.animateCurrentPractices();
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
    clearInterval(this.animationIntervalId);
  },
  methods: {
    animateValue(start, end, duration) {
      const counter = this.$refs.currentPractices;
      if (!counter) return;
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        counter.innerText = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    },
    animateCurrentPractices() {
      if (!this.$refs.currentPractices) return;

      let currentCount = parseInt(this.$refs.currentPractices.innerText) || this.min;

      this.animationIntervalId = setInterval(() => {
        const randomCount = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
        this.animateValue(currentCount, randomCount, 500); // Animate over 500ms
        currentCount = randomCount;
      }, 2000); // Update every 2 seconds
    },
    updateTimeAgo() {
      const now = new Date();
      const seconds = Math.floor((now - this.mostRecent) / 1000);

      let interval = seconds / 31536000;
      if (interval > 1) {
        this.mostRecentTimeAgo = Math.floor(interval) + " years ago";
        return;
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        this.mostRecentTimeAgo = Math.floor(interval) + " months ago";
        return;
      }
      interval = seconds / 86400;
      if (interval > 1) {
        this.mostRecentTimeAgo = Math.floor(interval) + " days ago";
        return;
      }
      interval = seconds / 3600;
      if (interval > 1) {
        this.mostRecentTimeAgo = Math.floor(interval) + " hours ago";
        return;
      }
      interval = seconds / 60;
      if (interval > 1) {
        this.mostRecentTimeAgo = Math.floor(interval) + " minutes ago";
        return;
      }
      this.mostRecentTimeAgo = "just now";
    },
  },
};
</script>

<style scoped>
.realtime-metrics {
  border: 1px solid #4a5568;
}
.metric-item .text-4xl {
  transition: all 0.5s ease-in-out;
}
.pulsing-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #48bb78; /* green-500 */
  border-radius: 50%;
  margin-right: 8px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(72, 187, 120, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(72, 187, 120, 0);
  }
}
</style>