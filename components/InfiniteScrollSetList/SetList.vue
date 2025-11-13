<template>
  <div class="z-121">
    <div v-if="isLoading">Loading...</div>
    <div v-else class="card-list-container space-y-4">
      <div
        v-for="practice in practiceSets"
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
    openPractice(practiceId) {
      this.$router.push({ name: 'id', params: { id: practiceId } });
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
};
</script>