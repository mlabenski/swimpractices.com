
<template>
  <div class="z-121">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold mb-4 text-white" v-if="!changeTheme">{{ title }}</h2>
          <span class="material-icons cursor-pointer" @click="toggleTable">
            {{ isTableVisible ? 'expand_less' : 'expand_more' }}
          </span>
      </div>
    <div v-if="isLoading">Loading...</div>
    <table v-else-if="isTableVisible" class="w-full mt-4 border-2 border-gray-400 divide-y divide-gray-200">
      <thead class="bg-customYellow">
      <tr>
        <th class="px-4 py-2">Practice Name</th>
        <th class="px-4 py-2">Distance</th>
        <th class="px-4 py-2 pl-2"><br></th>
        <th class="px-4 py-2 pl-2"><br></th>
      </tr>
      </thead>
    <tbody class="bg-customGrey">
    <tr v-for="(practice, practiceId) in practiceSets" :key="practiceId" class="text-center bg-white shadow-md">
      <td class="px-4 py-2 border">{{ practice.name }}</td>
      <td class="px-4 py-2 border" >{{ getTotalYardage(practice.sets) }}</td>
      <td class="px-4 py-2 border">
        <router-link :to="{ name: 'id', params: { id: practiceId } }" class="text-blue-600 underline"><span class="material-icons">
    open_in_full
    </span></router-link>
      </td>
      <td class="px-4 py-2 border">
        <button v-if="practice.userID === userID" @click="deletePractice(practiceId)" class="text-red-600 underline ml-4"><span class="material-icons">
  delete_forever
  </span></button>
      </td>
    </tr>
    </tbody>

    </table>
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
      isTableVisible: true
    };
  },
  computed: {
    isLoading() {
      return this.$store.getters.isLoading; // Assuming you have an `isLoading` state in your Vuex store
    },
    practices() {
      return this.$store.getters.practicesNew; // Assuming you have a `practices` getter in your Vuex store
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
    getTotalYardage(sets) {
      let totalYardage = 0;
      for (const setId in sets) {
        const set = sets[setId];
        set.exercises.forEach((exercise) => {
          totalYardage += exercise.distance * exercise.quantity;
        });
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
