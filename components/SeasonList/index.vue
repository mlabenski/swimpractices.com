<template>
  <div class="fixed z-10 inset-0 overflow-y-auto" v-if="seasons">
    <div class="flex items-center justify-center min-h-screen">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div class="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Add Practice to Season</h3>
        <div v-for="season in seasons" :key="season.id" @click="addPracticeToSeason(season.id)">
          <p class="font-medium text-gray-900">{{ season.title }}</p>
        </div>
        <form @submit.prevent="createSeason">
          <input v-model="newSeasonTitle" type="text" placeholder="New season title" required>
          <input v-model="newSeasonDescription" type="text" placeholder="New season description" required>
          <button type="submit">Create New Season</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters({
      user: 'auth/user',
      isLoading: 'getLoading',
    }),
  },
  data() {
    return {
      newSeasonTitle: '',
      newSeasonDescription: '',
      seasons: [], // To be fetched from Firestore
    };
  },
  created() {
    this.getSeasons();
  },
  methods: {
    async createSeason() {
      // Create a new season object
      const newSeason = {
        description: '',
        id: '', // replace with a way to generate unique ID
        likes: 0,
        practices: [],
        title: '',
        totalYardage: 0,
        userID: this.user.id // assuming this.user.id is available and refers to the current user's ID
      };

      // Add new season to Firestore
      try {
        await this.$fire.firestore.collection('seasons').add(newSeason);
        console.log('New season created');
      } catch (error) {
        console.error('Error creating new season: ', error);
      }
    },
    async addPracticeToSeason(seasonID) {
      // Add practice to season in Firestore
    },
    async getSeasons() {
      try {
        if(!this.user.id){
          return "no seasons";
        }
        const snapshot = await this.$fire.firestore.collection('seasons')
          .where('userID', '==', this.user.id)
          .get();

        const seasonsLocal = snapshot.docs.map(doc => doc.data());

        console.log('Seasons: ', seasonsLocal);
        this.seasons = seasonsLocal
        return seasonsLocal;
      } catch (error) {
        console.error('Error fetching seasons: ', error);
      }
    }
  },
};
</script>
