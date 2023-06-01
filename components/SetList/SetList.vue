<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">{{ title }}</h2>
    <div v-if="isLoading">Loading...</div>
    <table v-else class="w-full mt-4 border-2 border-gray-200 divide-y divide-gray-200">
      <thead class="bg-gray-200">
      <tr>
        <th class="px-4 py-2">Practice ID</th>
        <th class="px-4 py-2">Total Yardage</th>
        <th class="px-4 py-2">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="practiceSet in practiceSets" :key="practiceSet.PracticeID" class="text-center">
        <td class="px-4 py-2">Practice {{ practiceSet.PracticeID }}</td>
        <td class="px-4 py-2">{{ getTotalYardage(practiceSet.Sets) }} yards</td>
        <td class="px-4 py-2">
          <router-link :to="{ name: 'id', params: { id: practiceSet.PracticeID } }" class="text-blue-600 underline">View Details</router-link>
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
      type: Array,
      required: true
    },
  },
  data() {
    return {
      templates: [],
      isLoading: true,
    };
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
      this.isLoading = false;
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
      this.isLoading = false;
    },
    getTotalYardage(sets) {
      return sets.reduce((total, set) => {
        return total + set.Exercises.reduce((setTotal, exercise) => {
          return setTotal + (exercise.Distance * exercise.Quantity);
        }, 0);
      }, 0);
    }
  }
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
