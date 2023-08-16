<template>
  <div class="z-121">
    <div class="flex items-center justify-between border sm:border-transparent sm:bg-transparent sm:text-white bg-gray-200 text-black">
      <h2 class="text-2xl font-bold mb-1" v-if="!changeTheme">{{ title }}</h2>
      <span class="material-icons cursor-pointer" @click="toggleTable">
          {{ isTableVisible ? 'expand_less' : 'expand_more' }}
      </span>
    </div>



    <div v-if="isLoading">Loading...</div>
    <!-- Mobile view (Card Format) -->
    <div v-else-if="isTableVisible" class="sm:hidden">
      <router-link
        v-for="practice in paginatedData"
        :key="practice.practiceId"
        :to="{ name: 'id', params: { id: practice.id } }"
        @swipe.left="hidePractice(practice)"
        @swipe.right="openPractice(practice.id)"
        class="bg-white shadow-md p-4 rounded border-b border-gray-300 transform transition-transform duration-150 block"
      >
        <!-- Title -->
        <div class="font-bold text-lg mb-2">{{ practice.name }}</div>

        <!-- Pills -->
        <div class="flex">
          <span class="bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm">{{ getTotalYardage(practice.sets) }} Distance</span>
          <span class="bg-green-200 text-green-700 px-3 py-1 rounded-full text-sm">Freestyle</span>

          <!-- Conditional rendering for the measurement pill -->
          <span
            v-if="practice.measurement === 1"
            class="bg-red-200 text-red-700 px-3 py-1 rounded-full text-sm"
          >
            25 Yards
          </span>

          <span
            v-if="practice.measurement === 2"
            class="bg-red-200 text-red-700 px-3 py-1 rounded-full text-sm"
          >
            25 Meters
          </span>

          <span
            v-if="practice.measurement === 3"
            class="bg-red-200 text-red-700 px-3 py-1 rounded-full text-sm"
          >
            50 Meters
          </span>

          <span class="bg-yellow-200 text-yellow-700 px-3 py-1 rounded-full text-sm">Advanced</span>
        </div>


        <!-- Footer -->
        <div class="flex justify-between mt-2">
          <div class="flex space-x-2">
            <button class="text-gray-500">
              <span class="material-icons">thumb_up</span>
            </button>
            <button class="text-gray-500">
              <span class="material-icons">thumb_down</span>
            </button>
          </div>

          <div class="flex items-center space-x-2">
            <span class="material-icons text-gray-700">share</span>
            <span class="text-blue-600">Share</span>
          </div>
        </div>
      </router-link>
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
      required: false
    },
    changeTheme: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      templates: [],
      isTableVisible: true,
      currentPage: 1,
      itemsPerPage: 10
    };
  },
  computed: {
    isLoading() {
      return this.$store.getters['practices/isLoading'];
    },

    practices() {
      return this.$store.getters['practices/practices'];
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return Object.entries(this.practiceSets)
        .slice(start, end)
        .map(([practiceId, practice]) => ({...practice, practiceId}));
    },
    totalPages() {
      return Math.ceil(Object.keys(this.practiceSets).length / this.itemsPerPage);
    },
  },
  created() {
    // Fetch templates based on the component type (my templates or recommended templates)
    if (this.title === 'My Templates') {
      this.fetchMyTemplates();
    } else if (this.title === 'Recommended Templates') {
      this.fetchRecommendedTemplates();
    }
  },
  methods: {
    fetchMyTemplates() {
      // Make an API call to fetch user-specific templates
      // Example API call using axios:
      // axios.get('/api/my-templates')
      //   .then(response => {
      //     this.templates = response.data;
      //     this.isLoading = false;
      //   })
      //   .catch(error => {
      //     console.error(error);
      //     this.isLoading = false;
      //   });

      // Mock data for demonstration purposes
      this.templates = [
        { id: 1, name: 'Template 1' },
        { id: 2, name: 'Template 2' },
        { id: 3, name: 'Template 3' }
      ];
    },
    toggleTable() {
      this.isTableVisible = !this.isTableVisible;
    },
    hidePractice(practice) {
      const index = this.practiceSets.findIndex(p => p.practiceId === practice.practiceId);
      if (index !== -1) {
        this.practiceSets.splice(index, 1);
      }
    },
    openPractice(practiceId) {
      this.$router.push({ name: 'id', params: { id: practiceId } });
    },
    fetchRecommendedTemplates() {
      // Fetch recommended templates from a JSON file stored on the frontend
      // Example using import statement:
      // import recommendedTemplates from '@/data/recommended-templates';
      // this.templates = recommendedTemplates;

      // Mock data for demonstration purposes
      this.templates = [
        { id: 1, name: 'Recommended Template 1' },
        { id: 2, name: 'Recommended Template 2' },
        { id: 3, name: 'Recommended Template 3' }
      ];
    },
    nextPage() {
      if(this.currentPage < this.totalPages) this.currentPage++;
    },
    previousPage() {
      if(this.currentPage > 1) this.currentPage--;
    },
    getTotalYardage(sets) {
      let totalYardage = 0;
      for (const setId in sets) {
        const set = sets[setId];
        for (const exerciseId in set.exercises) {
          const exercise = set.exercises[exerciseId];
          totalYardage += exercise.distance * exercise.quantity;
        }
      }
      return totalYardage;
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
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
