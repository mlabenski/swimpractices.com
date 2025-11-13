<template>
  <div class="realtime-metrics p-5 rounded-xl text-white">
    <div class="metrics-grid">
      <!-- Live Practices Now -->
      <div class="metric-card">
        <div class="metric-icon">
          <span class="pulsing-dot"></span>
          <activity-icon :size="20" class="icon" />
        </div>
        <div class="metric-value text-green-400">
          <span ref="currentPractices">0</span>
        </div>
        <div class="metric-label">Practices Now</div>
      </div>

      <!-- Total Practices Library -->
      <div v-if="metrics.total_practices" class="metric-card">
        <div class="metric-icon">
          <library-icon :size="20" class="icon" />
        </div>
        <div class="metric-value">
          {{ formatNumber(metrics.total_practices) }}
        </div>
        <div class="metric-label">Total Practices</div>
      </div>

      <!-- Active Users Today -->
      <div v-if="metrics.active_users_today" class="metric-card">
        <div class="metric-icon">
          <account-group-icon :size="20" class="icon" />
        </div>
        <div class="metric-value text-blue-400">
          {{ formatNumber(metrics.active_users_today) }}
        </div>
        <div class="metric-label">Active Today</div>
      </div>

      <!-- Practices This Week -->
      <div v-if="metrics.practices_this_week" class="metric-card">
        <div class="metric-icon">
          <plus-circle-icon :size="20" class="icon" />
        </div>
        <div class="metric-value text-purple-400">
          +{{ formatNumber(metrics.practices_this_week) }}
        </div>
        <div class="metric-label">Added This Week</div>
      </div>

      <!-- Most Recent Activity -->
      <div class="metric-card">
        <div class="metric-icon">
          <clock-icon :size="20" class="icon" />
        </div>
        <div class="metric-value text-sm">{{ mostRecentTimeAgo }}</div>
        <div class="metric-label">Most Recent</div>
      </div>

      <!-- Trending Category (if available) -->
      <div v-if="metrics.trending_category" class="metric-card">
        <div class="metric-icon">
          <fire-icon :size="20" class="icon" />
        </div>
        <div class="metric-value text-sm text-orange-400">{{ metrics.trending_category }}</div>
        <div class="metric-label">Trending</div>
      </div>
    </div>
  </div>
</template>

<script>
import ActivityIcon from 'vue-material-design-icons/ChartLineVariant.vue';
import LibraryIcon from 'vue-material-design-icons/BookMultiple.vue';
import AccountGroupIcon from 'vue-material-design-icons/AccountGroup.vue';
import PlusCircleIcon from 'vue-material-design-icons/PlusCircle.vue';
import ClockIcon from 'vue-material-design-icons/ClockOutline.vue';
import FireIcon from 'vue-material-design-icons/Fire.vue';

export default {
  components: {
    ActivityIcon,
    LibraryIcon,
    AccountGroupIcon,
    PlusCircleIcon,
    ClockIcon,
    FireIcon,
  },
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
    formatNumber(num) {
      if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
      }
      return num.toString();
    },
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
/* Glassmorphism container */
.realtime-metrics {
  background: rgba(31, 41, 55, 0.5); /* gray-800 with transparency */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(107, 114, 128, 0.2); /* subtle border */
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
}

/* Grid layout - responsive */
.metrics-grid {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 1rem;
}

/* Individual metric card */
.metric-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.75rem;
  background: rgba(55, 65, 81, 0.3); /* gray-700 subtle background */
  border-radius: 0.75rem;
  border: 1px solid rgba(75, 85, 99, 0.3);
  transition: all 0.3s ease;
  min-height: 100px;
}

.metric-card:hover {
  background: rgba(55, 65, 81, 0.5);
  border-color: rgba(107, 114, 128, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Icon container */
.metric-icon {
  position: relative;
  margin-bottom: 0.5rem;
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-icon .icon {
  color: rgba(229, 231, 235, 0.8); /* gray-200 */
}

/* Metric value */
.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: #f3f4f6; /* gray-100 */
  transition: all 0.5s ease-in-out;
  margin-bottom: 0.25rem;
}

/* Metric label */
.metric-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(156, 163, 175, 0.9); /* gray-400 */
  font-weight: 500;
  text-align: center;
}

/* Pulsing dot for live indicator */
.pulsing-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: #48bb78; /* green-500 */
  border-radius: 50%;
  animation: pulse 1.5s infinite;
  z-index: 10;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px rgba(72, 187, 120, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(72, 187, 120, 0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .metrics-grid {
    grid-auto-flow: row;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .metric-card {
    padding: 0.75rem 0.5rem;
    min-height: 90px;
  }

  .metric-value {
    font-size: 1.25rem;
  }

  .metric-label {
    font-size: 0.65rem;
  }
}
</style>