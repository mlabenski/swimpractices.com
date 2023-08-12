<template>
  <div class="z-121">
    <div class="flex items-center justify-between border sm:border-transparent sm:bg-transparent sm:text-white bg-gray-200 text-black">
      <h2 class="text-2xl font-bold mb-1 px-2" v-if="!changeTheme">{{ title }}</h2>
      <span class="material-icons cursor-pointer" @click="toggleTable">
    {{ isTableVisible ? 'expand_less' : 'expand_more' }}
  </span>
    </div>



    <div v-if="isLoading">Loading...</div>
    <!-- Mobile view (Card Format) -->
    <div v-else-if="isTableVisible" class="sm:hidden">
      <div
        v-for="practice in paginatedData"
        :key="practice.practiceId"
        class="bg-white shadow-md rounded border-b-3 border-gray-300 transform transition-transform duration-150 hover:-translate-y-1"
      >
        <div class="font-bold text-xl mb-2">{{ practice.name }}</div>
        <div class="text-gray-600 font-medium mb-4">{{ getTotalYardage(practice.sets) }} Distance</div>
        <div class="flex justify-between">
          <router-link :to="{ name: 'id', params: { id: practice.id } }" class="text-blue-500 font-semibold">
            <span class="material-icons">open_in_full</span> View
          </router-link>
          <button v-if="practice.userID === userID" @click="deletePractice(practiceId)" class="text-red-600">
            <span class="material-icons">delete_forever</span>
          </button>
        </div>
      </div>
    </div>
    <div v-if="isTableVisible" class="flex justify-center mt-4 space-x-1 sm:space-x-4">
      <button @click="previousPage" :disabled="currentPage === 1" class="px-2 sm:px-4 py-1 sm:py-2 bg-transparent text-xs sm:text-base text-black rounded disabled:opacity-50">
        <span class="sm:hidden material-icons">chevron_left</span>
      </button>
      <div class="self-center text-sm sm:text-lg font-bold">Page {{ currentPage }} of {{ totalPages }}</div>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="px-2 sm:px-4 py-1 sm:py-2 bg-transparent text-xs sm:text-base text-black rounded disabled:opacity-50">
        <span class="sm:hidden material-icons">chevron_right</span>
      </button>
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
