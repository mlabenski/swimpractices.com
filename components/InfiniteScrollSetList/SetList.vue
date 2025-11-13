<template>
  <div class="z-121">
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <div class="card-list-container space-y-4">
        <div
          v-for="practice in paginatedPractices"
          :key="practice.id"
          @click="openPractice(practice.id)"
          class="bg-white shadow-md p-4 rounded border-b border-gray-300 cursor-pointer text-gray-800"
        >
        <!-- Title -->
        <div class="flex justify-between items-center mb-2">
          <div class="font-bold text-lg">{{ practice.name }}</div>
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
        <div class="flex justify-between mt-4">
          <div class="flex space-x-2">
            <button @click.stop="" class="text-gray-500">
              <span class="material-icons">thumb_up</span>
            </button>
            <button @click.stop="" class="text-gray-500">
              <span class="material-icons">thumb_down</span>
            </button>
          </div>

          <div class="flex items-center space-x-2">
            <span class="material-icons text-gray-700" @click.stop="">share</span>
            <span class="text-blue-600" @click.stop="">Share</span>
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
        Page {{ currentPage }} of {{ totalPages }} ({{ practiceSets.length }} total practices)
      </div>
    </div>
  </div>
</template>

<script>
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
      itemsPerPage: 20
    };
  },
  computed: {
    isLoading() {
      return this.$store.getters['practices/isLoading'];
    },
    totalPages() {
      return Math.ceil(this.practiceSets.length / this.itemsPerPage);
    },
    paginatedPractices() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.practiceSets.slice(start, end);
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
  },
  methods: {
    openPractice(practiceId) {
      this.$router.push({ name: 'id', params: { id: practiceId } });
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
    },
  },
  watch: {
    practiceSets() {
      // Reset to page 1 when practice sets change (e.g., from filtering)
      this.currentPage = 1;
    }
  },
};
</script>