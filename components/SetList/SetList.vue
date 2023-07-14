<template>
  <div class="z-121">
    <div class="flex items-center justify-between border sm:border-transparent sm:bg-transparent sm:text-white bg-gray-200 text-black px-2" style="background-color: #1F487E">
      <h2 class="text-2xl font-bold sm:hidden mb-1" v-if="!changeTheme">{{ title }}</h2>
      <span class="material-icons cursor-pointer" @click="toggleTable">
    {{ isTableVisible ? 'expand_less' : 'expand_more' }}
  </span>
    </div>



    <div v-if="isLoading">Loading...</div>
    <table v-else-if="isTableVisible" class="w-full mt-4 border-2 border-gray-400 divide-y divide-gray-200">
      <thead class="bg-customYellow">
      <tr>
        <th class="px-2 sm:px-4 py-2 text-xs sm:text-base">Practice Name</th>
        <th class="px-2 sm:px-4 py-2 text-xs sm:text-base">Distance</th>
        <th class="px-2 sm:px-4 py-2 text-xs sm:text-base pl-2"><br></th>
        <th class="px-2 sm:px-4 py-2 text-xs sm:text-base pl-2"><br></th>
      </tr>
      </thead>
      <tbody class="bg-customGrey">
      <tr v-for="practice in paginatedData" :key="practice.practiceId" class="text-center bg-white shadow-md">
        <td class="px-2 sm:px-4 py-2 border text-xs sm:text-base">{{ practice.name }}</td>
        <td class="px-2 sm:px-4 py-2 border text-xs sm:text-base">{{ getTotalYardage(practice.sets) }}</td>
        <td class="px-2 sm:px-4 py-2 border text-xs sm:text-base">
          <router-link :to="{ name: 'id', params: { id: practice.practiceId } }" class="text-blue-600 underline"><span class="material-icons">
    open_in_full
    </span></router-link>
        </td>
        <td class="px-2 sm:px-4 py-2 border text-xs sm:text-base">
          <button v-if="practice.userID === userID" @click="deletePractice(practiceId)" class="text-red-600 underline ml-4"><span class="material-icons">
    delete_forever
    </span></button>
        </td>
      </tr>
      </tbody>
    </table>
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
      type: Object,
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
