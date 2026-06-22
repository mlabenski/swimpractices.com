<template>
  <div class="z-121">
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <!-- Toolbar: title + view toggle -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-white text-xl font-bold">{{ title }}</h2>
        <div class="inline-flex rounded-lg overflow-hidden border border-gray-600">
          <button
            @click="setViewMode('card')"
            :class="[
              'flex items-center gap-1 px-3 py-2 text-sm transition',
              viewMode === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
            title="Card view"
          >
            <span class="material-icons text-base">grid_view</span>
            <span class="hidden sm:inline">Cards</span>
          </button>
          <button
            @click="setViewMode('list')"
            :class="[
              'flex items-center gap-1 px-3 py-2 text-sm transition',
              viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
            title="List view"
          >
            <span class="material-icons text-base">view_list</span>
            <span class="hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      <!-- Filters & Sort -->
      <div class="flex flex-wrap items-center gap-2 mb-4">
        <select v-model="selectedStroke" class="filter-select" aria-label="Filter by stroke">
          <option value="">All Strokes</option>
          <option v-for="stroke in availableStrokes" :key="stroke" :value="stroke">{{ stroke }}</option>
        </select>

        <select v-model="selectedLevel" class="filter-select" aria-label="Filter by level">
          <option value="">All Levels</option>
          <option value="easy">Easy</option>
          <option value="med">Medium</option>
          <option value="adv">Advanced</option>
        </select>

        <select v-model="selectedPool" class="filter-select" aria-label="Filter by pool">
          <option value="">All Pools</option>
          <option value="1">25 Yards</option>
          <option value="2">25 Meters</option>
          <option value="3">50 Meters</option>
        </select>

        <select v-model="sortBy" class="filter-select" aria-label="Sort practices">
          <option value="random">Sort: Shuffle</option>
          <option value="distance-asc">Distance: Low → High</option>
          <option value="distance-desc">Distance: High → Low</option>
          <option value="title-asc">Title: A → Z</option>
        </select>

        <button
          v-if="sortBy === 'random'"
          @click="reshuffle"
          class="flex items-center gap-1 px-3 py-2 text-sm rounded-lg bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 transition"
          title="Reshuffle practices"
        >
          <span class="material-icons text-base">shuffle</span>
          <span class="hidden sm:inline">Shuffle</span>
        </button>

        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="px-3 py-2 text-sm text-gray-400 hover:text-white transition"
        >
          Clear filters
        </button>

        <span class="ml-auto text-gray-400 text-sm">{{ processedPractices.length }} results</span>
      </div>

      <!-- Empty state -->
      <div v-if="processedPractices.length === 0" class="bg-white rounded shadow-md px-4 py-10 text-center text-gray-500">
        No practices match the selected filters.
      </div>

      <!-- Card View -->
      <div v-else-if="viewMode === 'card'" class="card-list-container space-y-4">
        <div
          v-for="practice in paginatedPractices"
          :key="practice.id"
          @click="openPractice(practice.id)"
          class="bg-white shadow-md p-4 rounded border-b border-gray-300 cursor-pointer text-gray-800"
        >
        <!-- Title -->
        <div class="flex justify-between items-center mb-2">
          <div class="font-bold text-lg">{{ practice.title || practice.name }}</div>
          <div class="text-lg text-gray-600">{{ practice.totalTime }}</div>
        </div>

        <!-- Pills -->
        <div class="flex flex-wrap gap-2">
          <span class="bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm">{{ practice.totalYardage }} Distance</span>
          <span class="bg-green-200 text-green-700 px-3 py-1 rounded-full text-sm">{{ practice.primaryStroke }}</span>

          <span v-if="practice.measurement === 1" class="bg-red-200 text-red-700 px-3 py-1 rounded-full text-sm">25 Yards</span>
          <span v-if="practice.measurement === 2" class="bg-red-200 text-red-700 px-3 py-1 rounded-full text-sm">25 Meters</span>
          <span v-if="practice.measurement === 3" class="bg-red-200 text-red-700 px-3 py-1 rounded-full text-sm">50 Meters</span>

          <span class="bg-yellow-400 text-yellow-800 px-3 py-1 rounded-full text-sm" v-if="practice.totalYardage >= 5000">Adv</span>
          <span class="bg-yellow-200 text-yellow-600 px-3 py-1 rounded-full text-sm" v-else-if="practice.totalYardage >= 3000">Med</span>
          <span class="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm" v-else-if="practice.totalYardage >= 500">Easy</span>
        </div>

        <!-- Footer -->
        <div class="flex justify-between mt-4 items-center">
          <div class="flex space-x-2">
            <button @click.stop="" class="text-gray-500">
              <span class="material-icons">thumb_up</span>
            </button>
            <button @click.stop="" class="text-gray-500">
              <span class="material-icons">thumb_down</span>
            </button>
          </div>

          <div class="flex items-center space-x-3">
            <button
              @click.stop="copyId(practice.id)"
              class="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
              :title="`Copy practice ID: ${practice.id}`"
            >
              <span class="material-icons text-base">{{ copiedId === practice.id ? 'check' : 'content_copy' }}</span>
              <span class="text-sm">{{ copiedId === practice.id ? 'Copied!' : 'Copy ID' }}</span>
            </button>
            <span class="material-icons text-gray-700" @click.stop="">share</span>
            <span class="text-blue-600" @click.stop="">Share</span>
          </div>
        </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="bg-white rounded shadow-md overflow-hidden divide-y divide-gray-200">
        <!-- Header row (desktop only) -->
        <div class="hidden md:grid grid-cols-12 gap-2 px-4 py-2 bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <div class="col-span-4">Practice</div>
          <div class="col-span-2">Distance</div>
          <div class="col-span-1">Time</div>
          <div class="col-span-2">Stroke</div>
          <div class="col-span-1">Level</div>
          <div class="col-span-2 text-right">Practice ID</div>
        </div>

        <div
          v-for="practice in paginatedPractices"
          :key="practice.id"
          @click="openPractice(practice.id)"
          class="grid grid-cols-2 md:grid-cols-12 gap-2 px-4 py-3 cursor-pointer text-gray-800 hover:bg-blue-50 transition items-center"
        >
          <!-- Title -->
          <div class="col-span-2 md:col-span-4 font-semibold truncate">{{ practice.title || practice.name }}</div>

          <!-- Distance -->
          <div class="md:col-span-2 text-sm text-gray-600">
            <span class="md:hidden text-gray-400">Distance: </span>{{ practice.totalYardage }}
          </div>

          <!-- Time -->
          <div class="md:col-span-1 text-sm text-gray-600">
            <span class="md:hidden text-gray-400">Time: </span>{{ practice.totalTime || '—' }}
          </div>

          <!-- Stroke -->
          <div class="md:col-span-2 text-sm text-gray-600 truncate">
            <span class="md:hidden text-gray-400">Stroke: </span>{{ practice.primaryStroke || '—' }}
          </div>

          <!-- Level -->
          <div class="md:col-span-1">
            <span class="bg-yellow-400 text-yellow-800 px-2 py-0.5 rounded-full text-xs" v-if="practice.totalYardage >= 5000">Adv</span>
            <span class="bg-yellow-200 text-yellow-600 px-2 py-0.5 rounded-full text-xs" v-else-if="practice.totalYardage >= 3000">Med</span>
            <span class="bg-green-200 text-green-800 px-2 py-0.5 rounded-full text-xs" v-else-if="practice.totalYardage >= 500">Easy</span>
            <span class="text-gray-400 text-xs" v-else>—</span>
          </div>

          <!-- Practice ID + copy -->
          <div class="col-span-2 md:col-span-2 flex md:justify-end">
            <button
              @click.stop="copyId(practice.id)"
              class="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-700 transition font-mono text-xs max-w-full"
              :title="`Copy practice ID: ${practice.id}`"
            >
              <span class="material-icons text-sm">{{ copiedId === practice.id ? 'check' : 'content_copy' }}</span>
              <span class="truncate">{{ copiedId === practice.id ? 'Copied!' : practice.id }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2 mt-8 pb-4">
        <button
          @click="goToPage(1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          First
        </button>
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>

        <div class="flex space-x-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-2 rounded transition',
              currentPage === page
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
        <button
          @click="goToPage(totalPages)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Last
        </button>
      </div>

      <div v-if="totalPages > 1" class="text-center text-gray-400 text-sm mt-2">
        Page {{ currentPage }} of {{ totalPages }} ({{ processedPractices.length }} practices)
      </div>
    </div>
  </div>
</template>

<script>
import { practicePath } from '@/lib/practiceRoutes'

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    practiceSets: {
      type: Array,
      required: true
    },
    userID: {
      type: String,
      optional: true
    },
    changeTheme: {
      type: Number,
      optional: true
    }
  },
  data() {
    return {
      templates: [],
      currentPage: 1,
      itemsPerPage: 20,
      viewMode: 'card',
      copiedId: null,
      // Filter & sort state (all client-side; Firestore query is untouched)
      selectedStroke: '',
      selectedLevel: '',
      selectedPool: '',
      sortBy: 'random',
      shuffledSets: []
    };
  },
  computed: {
    isLoading() {
      return this.$store.getters['practices/isLoading'];
    },
    availableStrokes() {
      const strokes = new Set();
      this.practiceSets.forEach((p) => {
        if (p.primaryStroke) strokes.add(p.primaryStroke);
      });
      return Array.from(strokes).sort();
    },
    hasActiveFilters() {
      return !!(this.selectedStroke || this.selectedLevel || this.selectedPool);
    },
    processedPractices() {
      // Start from the shuffled copy so the default order is randomized
      const base = this.shuffledSets.length ? this.shuffledSets : this.practiceSets;

      let list = base.filter((p) => {
        if (this.selectedStroke && p.primaryStroke !== this.selectedStroke) return false;
        if (this.selectedLevel && this.levelOf(p) !== this.selectedLevel) return false;
        if (this.selectedPool && String(p.measurement) !== this.selectedPool) return false;
        return true;
      });

      if (this.sortBy === 'distance-asc') {
        list = [...list].sort((a, b) => (a.totalYardage || 0) - (b.totalYardage || 0));
      } else if (this.sortBy === 'distance-desc') {
        list = [...list].sort((a, b) => (b.totalYardage || 0) - (a.totalYardage || 0));
      } else if (this.sortBy === 'title-asc') {
        list = [...list].sort((a, b) =>
          (a.title || a.name || '').localeCompare(b.title || b.name || '')
        );
      }
      // 'random' keeps the pre-shuffled order
      return list;
    },
    totalPages() {
      return Math.ceil(this.processedPractices.length / this.itemsPerPage);
    },
    paginatedPractices() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.processedPractices.slice(start, end);
    },
    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);

      // Adjust startPage if we're near the end
      if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    }
  },
  created() {
    if (this.title === 'My Templates') {
      this.fetchMyTemplates();
    } else if (this.title === 'Recommended Templates') {
      this.fetchRecommendedTemplates();
    }
    // Randomize the initial order client-side
    this.buildShuffled();
    // Restore the user's preferred view mode
    if (process.client) {
      const savedView = localStorage.getItem('practiceListView');
      if (savedView === 'list' || savedView === 'card') {
        this.viewMode = savedView;
      }
    }
  },
  methods: {
    levelOf(practice) {
      const yards = practice.totalYardage || 0;
      if (yards >= 5000) return 'adv';
      if (yards >= 3000) return 'med';
      if (yards >= 500) return 'easy';
      return 'none';
    },
    buildShuffled() {
      // Fisher–Yates shuffle of a shallow copy (does not mutate the prop)
      const arr = [...this.practiceSets];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      this.shuffledSets = arr;
    },
    reshuffle() {
      this.buildShuffled();
      this.currentPage = 1;
    },
    clearFilters() {
      this.selectedStroke = '';
      this.selectedLevel = '';
      this.selectedPool = '';
      this.currentPage = 1;
    },
    openPractice (practiceId) {
      this.$router.push(practicePath(practiceId))
    },
    setViewMode(mode) {
      this.viewMode = mode;
      if (process.client) {
        localStorage.setItem('practiceListView', mode);
      }
    },
    async copyId(practiceId) {
      try {
        await navigator.clipboard.writeText(practiceId);
        this.copiedId = practiceId;
        this.$store.dispatch('notifications/addNotification', {
          message: 'Practice ID copied to clipboard!',
          type: 3
        });
        setTimeout(() => {
          if (this.copiedId === practiceId) this.copiedId = null;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy practice ID: ', err);
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.scrollToTop();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.scrollToTop();
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.scrollToTop();
      }
    },
    scrollToTop() {
      // Scroll to the top of the practice list
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },
    fetchMyTemplates() {
      this.templates = [
        { id: 1, name: 'Template 1' },
        { id: 2, name: 'Template 2' },
        { id: 3, name: 'Template 3' }
      ];
    },
    fetchRecommendedTemplates() {
      this.templates = [
        { id: 1, name: 'Recommended Template 1' },
        { id: 2, name: 'Recommended Template 2' },
        { id: 3, name: 'Recommended Template 3' }
      ];
    },
    async deletePractice(practiceId) {
      try {
        await this.$fire.firestore.collection('practices').doc(practiceId).delete();
        console.log('Practice deleted');
      } catch (error) {
        console.error('Error deleting practice: ', error);
      }
    }
  },
  watch: {
    practiceSets() {
      // Rebuild the shuffled order and reset to page 1 when the source data changes
      this.buildShuffled();
      this.currentPage = 1;
    },
    selectedStroke() {
      this.currentPage = 1;
    },
    selectedLevel() {
      this.currentPage = 1;
    },
    selectedPool() {
      this.currentPage = 1;
    },
    sortBy() {
      this.currentPage = 1;
    }
  },
};
</script>

<style scoped>
.filter-select {
  background-color: #1f2937; /* gray-800 */
  color: #e5e7eb; /* gray-200 */
  font-size: 0.875rem;
  border: 1px solid #4b5563; /* gray-600 */
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.filter-select:hover {
  border-color: #6b7280; /* gray-500 */
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6; /* blue-500 */
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
}
</style>