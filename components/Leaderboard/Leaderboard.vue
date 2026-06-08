<template>
  <div class="leaderboard-container p-5 rounded-xl text-white">
    <h2 class="leaderboard-title">iOS Leaderboard</h2>
    <p class="leaderboard-subtitle" v-if="updatedAt">
      Updated {{ updatedAtFormatted }}
    </p>

    <!-- High Score Banner -->
    <div v-if="highScore && highScore.distance > 0" class="high-score-banner">
      <div class="high-score-icon">
        <svg class="trophy-svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <path d="M18 2c.55 0 1 .45 1 1v3c0 1.66-1.34 3-3 3h-.38c-.55 1.56-1.75 2.78-3.25 3.42.09.52.37.98.78 1.32.55.46 1.25.71 1.98.74L15 14.5c0 .83-.67 1.5-1.5 1.5h-3c-.83 0-1.5-.67-1.5-1.5l-.13-.02c.73-.03 1.43-.28 1.98-.74.41-.34.69-.8.78-1.32-1.5-.64-2.7-1.86-3.25-3.42H8c-1.66 0-3-1.34-3-3V3c0-.55.45-1 1-1h2V1h8v1h2zM8 4H7v2c0 .55.45 1 1 1V4zm9 0h-1v3c.55 0 1-.45 1-1V4zM12 18c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2zm-4 4h8v-1H8v1z"/>
        </svg>
      </div>
      <div class="high-score-content">
        <span class="high-score-label">Longest Single Workout</span>
        <span class="high-score-value">{{ formatDistance(highScore.distance) }}</span>
        <span v-if="showUsernames" class="high-score-user">by {{ highScore.username || 'Unknown' }}</span>
      </div>
    </div>

    <!-- Tab Selector -->
    <div class="tab-bar">
      <button
        class="tab-button"
        :class="{ active: activeTab === 'distance' }"
        @click="activeTab = 'distance'"
      >
        Total Distance
      </button>
      <button
        class="tab-button"
        :class="{ active: activeTab === 'practices' }"
        @click="activeTab = 'practices'"
      >
        Practices
      </button>
    </div>

    <!-- Distance Leaderboard -->
    <div v-show="activeTab === 'distance'" class="leaderboard-list">
      <div
        v-for="(entry, index) in byTotalDistance"
        :key="'dist-' + entry.userID"
        class="leaderboard-row"
        :class="{ 'top-three': index < 3 }"
      >
        <div class="rank" :class="rankClass(index)">
          <span v-if="index < 3" class="rank-medal">{{ medalFor(index) }}</span>
          <span v-else class="rank-number">{{ index + 1 }}</span>
        </div>
        <div class="user-info">
          <span v-if="showUsernames" class="username">{{ entry.username }}</span>
          <span class="user-stat-secondary">{{ entry.practiceCount }} practices</span>
        </div>
        <div class="stat-value">{{ formatDistance(entry.totalDistance) }}</div>
      </div>
      <div v-if="!byTotalDistance || byTotalDistance.length === 0" class="empty-state">
        No leaderboard data yet.
      </div>
    </div>

    <!-- Practice Count Leaderboard -->
    <div v-show="activeTab === 'practices'" class="leaderboard-list">
      <div
        v-for="(entry, index) in byPracticeCount"
        :key="'prac-' + entry.userID"
        class="leaderboard-row"
        :class="{ 'top-three': index < 3 }"
      >
        <div class="rank" :class="rankClass(index)">
          <span v-if="index < 3" class="rank-medal">{{ medalFor(index) }}</span>
          <span v-else class="rank-number">{{ index + 1 }}</span>
        </div>
        <div class="user-info">
          <span v-if="showUsernames" class="username">{{ entry.username }}</span>
          <span class="user-stat-secondary">{{ formatDistance(entry.totalDistance) }}</span>
        </div>
        <div class="stat-value">{{ entry.practiceCount }}</div>
      </div>
      <div v-if="!byPracticeCount || byPracticeCount.length === 0" class="empty-state">
        No leaderboard data yet.
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Leaderboard',
  props: {
    leaderboardData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      activeTab: 'distance',
    };
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
    }),
    accessLevel() {
      return this.user ? 'full' : 'free';
    },
    showUsernames() {
      return this.accessLevel === 'full';
    },
    byTotalDistance() {
      return this.leaderboardData?.byTotalDistance || [];
    },
    byPracticeCount() {
      return this.leaderboardData?.byPracticeCount || [];
    },
    highScore() {
      return this.leaderboardData?.highScore || null;
    },
    updatedAt() {
      return this.leaderboardData?.updatedAt || null;
    },
    updatedAtFormatted() {
      if (!this.updatedAt) return '';
      try {
        const date = this.updatedAt.toDate ? this.updatedAt.toDate() : new Date(this.updatedAt);
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        });
      } catch {
        return '';
      }
    },
  },
  methods: {
    formatDistance(meters) {
      if (meters == null) return '0 m';
      if (meters >= 1000) {
        return (meters / 1000).toFixed(1).replace(/\.0$/, '') + ' km';
      }
      return meters.toLocaleString() + ' m';
    },
    rankClass(index) {
      if (index === 0) return 'rank-gold';
      if (index === 1) return 'rank-silver';
      if (index === 2) return 'rank-bronze';
      return '';
    },
    medalFor(index) {
      const medals = ['1st', '2nd', '3rd'];
      return medals[index] || '';
    },
  },
};
</script>

<style scoped>
.leaderboard-container {
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(107, 114, 128, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 100%;
}

.leaderboard-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.125rem;
  color: #f3f4f6;
}

.leaderboard-subtitle {
  font-size: 0.7rem;
  color: rgba(156, 163, 175, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

/* High Score Banner */
.high-score-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.08));
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 0.75rem;
}

.high-score-icon {
  color: rgba(251, 191, 36, 0.9);
  flex-shrink: 0;
}

.high-score-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.high-score-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(251, 191, 36, 0.8);
  font-weight: 600;
}

.high-score-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fbbf24;
}

.high-score-user {
  font-size: 0.75rem;
  color: rgba(156, 163, 175, 0.9);
}

/* Tab Bar */
.tab-bar {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
  background: rgba(17, 24, 39, 0.4);
  border-radius: 0.5rem;
  padding: 0.25rem;
}

.tab-button {
  flex: 1;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  color: rgba(156, 163, 175, 0.9);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button.active {
  background: rgba(59, 130, 246, 0.25);
  color: #93c5fd;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.tab-button:hover:not(.active) {
  color: #d1d5db;
  background: rgba(55, 65, 81, 0.3);
}

/* Leaderboard List */
.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.leaderboard-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  background: rgba(55, 65, 81, 0.25);
  border-radius: 0.5rem;
  border: 1px solid rgba(75, 85, 99, 0.2);
  transition: all 0.2s ease;
}

.leaderboard-row:hover {
  background: rgba(55, 65, 81, 0.45);
  border-color: rgba(107, 114, 128, 0.3);
}

.leaderboard-row.top-three {
  background: rgba(55, 65, 81, 0.35);
  border-color: rgba(107, 114, 128, 0.25);
}

/* Rank */
.rank {
  width: 2rem;
  text-align: center;
  flex-shrink: 0;
}

.rank-medal {
  font-size: 0.75rem;
  font-weight: 800;
}

.rank-number {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 0.7);
}

.rank-gold .rank-medal {
  color: #fbbf24;
}

.rank-silver .rank-medal {
  color: #d1d5db;
}

.rank-bronze .rank-medal {
  color: #d97706;
}

/* User Info */
.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.username {
  font-size: 0.85rem;
  font-weight: 600;
  color: #e5e7eb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-stat-secondary {
  font-size: 0.675rem;
  color: rgba(156, 163, 175, 0.7);
}

/* Stat Value */
.stat-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #93c5fd;
  flex-shrink: 0;
  text-align: right;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: rgba(156, 163, 175, 0.7);
  font-size: 0.85rem;
}

/* Responsive: Mobile */
@media (max-width: 640px) {
  .leaderboard-container {
    padding: 1rem;
    border-radius: 0.75rem;
    max-width: 100%;
  }

  .leaderboard-title {
    font-size: 1.1rem;
  }

  .high-score-banner {
    padding: 0.625rem 0.75rem;
  }

  .high-score-value {
    font-size: 1.1rem;
  }

  .leaderboard-row {
    padding: 0.5rem 0.625rem;
    gap: 0.5rem;
  }

  .username {
    font-size: 0.8rem;
  }

  .stat-value {
    font-size: 0.8rem;
  }

  .tab-button {
    font-size: 0.75rem;
    padding: 0.4rem 0.5rem;
  }
}
</style>
