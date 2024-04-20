<template>
  <div class="z-121">
    <div class="flex items-center justify-between border sm:border-transparent sm:bg-transparent sm:text-white bg-gray-200 text-black px-2">
      <span class="material-icons cursor-pointer" @click="toggleTable">
        {{ isTableVisible ? 'expand_less' : 'expand_more' }}
      </span>
    </div>

    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isTableVisible" class="table-container">
      <table class="w-full border-2 border-gray-400 divide-y divide-gray-200">
        <thead style="background-color: #1F487E">
        <tr>
          <th class="px-2 sm:px-4 py-2 text-xs sm:text-base text-white">Practice Name</th>
          <th class="px-2 sm:px-4 py-2 text-xs sm:text-base text-white">Distance</th>
          <th class="px-2 sm:px-4 py-2 text-xs sm:text-base pl-2"></th>
          <th class="px-2 sm:px-4 py-2 text-xs sm:text-base pl-2"></th>
        </tr>
        </thead>
        <tbody class="bg-customGrey">
        <tr v-for="practice in practiceSets" :key="practice.practiceId" class="text-center bg-white shadow-md">
          <td class="px-2 sm:px-4 py-2 border text-xs sm:text-base">{{ practice.name }}</td>
          <td class="px-2 sm:px-4 py-2 border text-xs sm:text-base">{{ getTotalYardage(practice.sets) }}</td>
          <td class="px-2 sm:px-4 py-2 border text-xs sm:text-base">
            <router-link :to="{ name: 'id', params: { id: practice.id } }" class="text-blue-600 underline">
              <span class="material-icons">open_in_full</span>
            </router-link>
          </td>
          <td class="px-2 sm:px-4 py-2 border text-xs sm:text-base">
            <button v-if="practice.userID === userID" @click="deletePractice(practiceId)" class="text-red-600 underline ml-4">
              <span class="material-icons">delete_forever</span>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
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
      isTableVisible: true
    };
  },
  computed: {
    isLoading() {
      return this.$store.getters['practices/isLoading'];
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
    toggleTable() {
      this.isTableVisible = !this.isTableVisible;
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
.table-container {
  max-height: 400px; /* Adjust as necessary for your layout */
  overflow-y: scroll;
}
</style>
