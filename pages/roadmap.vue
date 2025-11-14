<template>
  <div class="roadmap-page min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
    <!-- Header -->
    <div class="container mx-auto px-4 py-8">
      <button
        @click="$router.push('/')"
        class="mb-6 flex items-center text-gray-300 hover:text-white transition-colors duration-200"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to Home
      </button>

      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold mb-4">Product Roadmap</h1>
        <p class="text-xl text-gray-300">See what we're building next for SwimPractices</p>
      </div>

      <!-- Featured Feature (if query param exists) -->
      <div v-if="selectedFeature" class="mb-12">
        <div class="roadmap-card featured-card">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-3xl font-bold mb-2">{{ selectedFeature.title }}</h2>
              <span :class="getStatusClass(selectedFeature.status)" class="status-badge">
                {{ selectedFeature.status }}
              </span>
            </div>
            <div v-if="selectedFeature.icon" class="text-5xl opacity-20">
              {{ selectedFeature.icon }}
            </div>
          </div>
          <p class="text-lg text-gray-300 mb-6">{{ selectedFeature.description }}</p>

          <div v-if="selectedFeature.features" class="mb-6">
            <h3 class="text-xl font-semibold mb-3">Key Features:</h3>
            <ul class="list-disc list-inside space-y-2 text-gray-300">
              <li v-for="feature in selectedFeature.features" :key="feature">{{ feature }}</li>
            </ul>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div class="stat-box">
              <div class="stat-label">Timeline</div>
              <div class="stat-value">{{ selectedFeature.timeline }}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Priority</div>
              <div class="stat-value">{{ selectedFeature.priority }}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Status</div>
              <div class="stat-value">{{ selectedFeature.status }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- All Features Grid -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold mb-6">All Upcoming Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="feature in features"
            :key="feature.id"
            @click="selectFeature(feature.id)"
            class="roadmap-card cursor-pointer"
            :class="{ 'featured-border': selectedFeature && selectedFeature.id === feature.id }"
          >
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-xl font-semibold">{{ feature.title }}</h3>
              <div v-if="feature.icon" class="text-2xl opacity-30">{{ feature.icon }}</div>
            </div>

            <p class="text-gray-300 text-sm mb-4 line-clamp-3">{{ feature.description }}</p>

            <div class="flex items-center justify-between">
              <span :class="getStatusClass(feature.status)" class="status-badge text-xs">
                {{ feature.status }}
              </span>
              <span class="text-xs text-gray-400">{{ feature.timeline }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="mt-12 roadmap-card">
        <h3 class="text-xl font-semibold mb-4">Status Legend</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div class="flex items-center space-x-2">
            <span class="status-badge status-available text-xs">Available Now</span>
            <span class="text-sm text-gray-400">Live and ready</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="status-badge status-in-development text-xs">In Development</span>
            <span class="text-sm text-gray-400">Actively building</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="status-badge status-coming-soon text-xs">Coming Q1 2026</span>
            <span class="text-sm text-gray-400">Planned release</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoadmapPage',
  head() {
    return {
      title: 'Product Roadmap - SwimPractices',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'See what features and improvements are coming to SwimPractices',
        },
      ],
    };
  },
  data() {
    return {
      features: [
        {
          id: 'ai-generator',
          title: 'Intelligent Practice Generator',
          description: 'Generate personalized swim practices using intelligent algorithms based on your team goals, skill level, and available time. The system creates balanced, progressive practices tailored to your specific needs.',
          status: 'Available Now',
          timeline: 'Live',
          priority: 'High',
          icon: '🤖',
          features: [
            'Custom practice generation based on yardage, duration, and focus',
            'Progressive difficulty adjustment',
            'Integration with existing practice library',
            'Save and share generated practices',
            'Multi-stroke and multi-distance support',
          ],
        },
        {
          id: 'wearable-devices',
          title: 'Wearable Devices',
          description: 'Integration with popular swimming wearables and smart watches to track performance metrics, heart rate, stroke count, and lap times. Sync data directly from your device to your practice logs.',
          status: 'Coming Q1 2026',
          timeline: 'Q1 2026',
          priority: 'High',
          icon: '⌚',
          features: [
            'Support for Garmin, Apple Watch, and Fitbit devices',
            'Real-time heart rate and lap time tracking',
            'Stroke count and efficiency metrics',
            'Automatic workout detection and sync',
            'Performance analytics and trends',
          ],
        },
        {
          id: 'teams',
          title: 'Team Management',
          description: 'Comprehensive team management tools for coaches to organize rosters, assign practices, track attendance, and monitor progress. Build and manage your entire swim team from one central dashboard.',
          status: 'In Development',
          timeline: 'Q2 2026',
          priority: 'High',
          icon: '👥',
          features: [
            'Team roster and swimmer profiles',
            'Assign practices to specific swimmers or groups',
            'Attendance tracking and reporting',
            'Team-wide practice library',
            'Parent/guardian communication tools',
            'Performance tracking per swimmer',
          ],
        },
      ],
    };
  },
  computed: {
    selectedFeature() {
      const featureId = this.$route.query.feature;
      if (!featureId) return null;
      return this.features.find((f) => f.id === featureId);
    },
  },
  methods: {
    selectFeature(featureId) {
      this.$router.push({ path: '/roadmap', query: { feature: featureId } });
    },
    getStatusClass(status) {
      const statusMap = {
        'Available Now': 'status-available',
        'In Development': 'status-in-development',
        'Coming Q1 2026': 'status-coming-soon',
        'Planned': 'status-planned',
        'Coming Soon': 'status-coming-soon',
        'Beta': 'status-beta',
      };
      return statusMap[status] || 'status-planned';
    },
  },
};
</script>

<style scoped>
/* Glassmorphism card styling */
.roadmap-card {
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(107, 114, 128, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.roadmap-card:hover {
  background: rgba(31, 41, 55, 0.7);
  border-color: rgba(107, 114, 128, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.3);
}

.roadmap-card.cursor-pointer:active {
  transform: translateY(0);
}

.featured-card {
  background: rgba(37, 99, 235, 0.1);
  border: 2px solid rgba(59, 130, 246, 0.5);
}

.featured-border {
  border: 2px solid rgba(59, 130, 246, 0.8);
}

/* Status badges */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-available {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.4);
}

.status-planned {
  background: rgba(156, 163, 175, 0.2);
  color: #d1d5db;
  border: 1px solid rgba(156, 163, 175, 0.4);
}

.status-coming-soon {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.4);
}

.status-in-development {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.4);
}

.status-beta {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
  border: 1px solid rgba(168, 85, 247, 0.4);
}

/* Stat boxes */
.stat-box {
  background: rgba(55, 65, 81, 0.3);
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid rgba(75, 85, 99, 0.3);
}

.stat-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(156, 163, 175, 0.9);
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #f3f4f6;
}

/* Line clamp utility */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .roadmap-card {
    padding: 1rem;
  }

  .featured-card h2 {
    font-size: 1.5rem;
  }
}
</style>
