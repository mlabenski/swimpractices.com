<template>
  <div class="realtime-metrics p-5 rounded-xl text-white">
    <div class="metrics-grid">
      <!-- Dynamic card rendering based on displayCards computed property -->
      <div
        v-for="card in displayCards"
        :key="card.index"
        class="metric-card"
        :class="{ 'cursor-pointer': isClickable(card), 'roadmap-card-style': card.type === 'roadmap' }"
        @click="handleCardClick(card)">

        <!-- Metric Card Content -->
        <template v-if="card.type === 'metric'">
          <div class="metric-icon">
            <span v-if="card.hasPulse" class="pulsing-dot"></span>
            <activity-icon v-if="card.icon === 'activity'" :size="20" class="icon" />
            <library-icon v-else-if="card.icon === 'library'" :size="20" class="icon" />
            <account-group-icon v-else-if="card.icon === 'account-group'" :size="20" class="icon" />
            <plus-circle-icon v-else-if="card.icon === 'plus-circle'" :size="20" class="icon" />
            <clock-icon v-else-if="card.icon === 'clock'" :size="20" class="icon" />
            <fire-icon v-else-if="card.icon === 'fire'" :size="20" class="icon" />
          </div>
          <div class="metric-value" :class="card.color">
            <span v-if="card.id === 'practices_now'" ref="currentPractices">0</span>
            <span v-else>{{ card.value }}</span>
          </div>
          <div class="metric-label">{{ card.label }}</div>
        </template>

        <!-- Roadmap Card Content -->
        <template v-else-if="card.type === 'roadmap'">
          <div class="roadmap-icon">
            <svg class="w-6 h-6 mb-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="roadmap-title">{{ card.title }}</div>
          <div class="roadmap-status">{{ card.status }}</div>
        </template>
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
    cards: {
      type: Array,
      default: null,
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
    },
    displayCards() {
      // If cards prop is not provided, use default metric cards
      if (!this.cards) {
        return this.getDefaultMetricCards();
      }

      // Map cards configuration to renderable card data
      return this.cards.map((card, index) => {
        if (card.type === 'metric') {
          return this.getMetricCardData(card.id, index);
        } else if (card.type === 'roadmap') {
          return {
            type: 'roadmap',
            title: card.title,
            status: card.status,
            route: card.route,
            index: index,
          };
        }
        return card;
      }).filter(card => card !== null);
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
    handleCardClick(card) {
      // Emit event with card data for parent to handle navigation
      this.$emit('card-clicked', card);
    },
    isClickable(card) {
      // Card is clickable if it has a route or is a roadmap type
      return card && (card.route || card.type === 'roadmap');
    },
    getDefaultMetricCards() {
      // Return default metric cards when no cards prop is provided
      return [
        { type: 'metric', id: 'practices_now', index: 0 },
        this.metrics.total_practices ? { type: 'metric', id: 'total_practices', index: 1 } : null,
        this.metrics.active_users_today ? { type: 'metric', id: 'active_today', index: 2 } : null,
        this.metrics.practices_this_week ? { type: 'metric', id: 'practices_this_week', index: 3 } : null,
        { type: 'metric', id: 'most_recent', index: 4 },
        this.metrics.trending_category ? { type: 'metric', id: 'trending', index: 5 } : null,
      ].filter(card => card !== null).map(card => this.getMetricCardData(card.id, card.index));
    },
    getMetricCardData(metricId, index) {
      const metricMap = {
        'practices_now': {
          type: 'metric',
          id: 'practices_now',
          icon: 'activity',
          value: null, // Will be animated
          label: 'Practices Now',
          color: 'text-green-400',
          hasPulse: true,
          index: index,
        },
        'total_practices': this.metrics.total_practices ? {
          type: 'metric',
          id: 'total_practices',
          icon: 'library',
          value: this.formatNumber(this.metrics.total_practices),
          label: 'Total Practices',
          color: '',
          index: index,
        } : null,
        'active_today': this.metrics.active_users_today ? {
          type: 'metric',
          id: 'active_today',
          icon: 'account-group',
          value: this.formatNumber(this.metrics.active_users_today),
          label: 'Active Today',
          color: 'text-blue-400',
          index: index,
        } : null,
        'practices_this_week': this.metrics.practices_this_week ? {
          type: 'metric',
          id: 'practices_this_week',
          icon: 'plus-circle',
          value: '+' + this.formatNumber(this.metrics.practices_this_week),
          label: 'Added This Week',
          color: 'text-purple-400',
          index: index,
        } : null,
        'most_recent': {
          type: 'metric',
          id: 'most_recent',
          icon: 'clock',
          value: this.mostRecentTimeAgo,
          label: 'Most Recent',
          color: 'text-sm',
          index: index,
        },
        'trending': this.metrics.trending_category ? {
          type: 'metric',
          id: 'trending',
          icon: 'fire',
          value: this.metrics.trending_category,
          label: 'Trending',
          color: 'text-sm text-orange-400',
          index: index,
        } : null,
      };

      return metricMap[metricId] || null;
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

.metric-card.cursor-pointer {
  cursor: pointer;
}

.metric-card.cursor-pointer:active {
  transform: translateY(0);
}

/* Roadmap card styling */
.roadmap-card-style {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.roadmap-card-style:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
}

.roadmap-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
  color: rgba(96, 165, 250, 0.9);
}

.roadmap-title {
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.2;
  color: #f3f4f6;
  text-align: center;
  margin-bottom: 0.5rem;
}

.roadmap-status {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(251, 191, 36, 0.9);
  font-weight: 500;
  text-align: center;
  background: rgba(251, 191, 36, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(251, 191, 36, 0.3);
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