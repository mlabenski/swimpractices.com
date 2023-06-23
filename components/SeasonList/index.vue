<template>
  <div class="fixed z-10 inset-0 overflow-y-auto" v-if="seasons">
    <div class="flex items-center justify-center min-h-screen">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div class="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Add Practice to Season</h3>
        <div v-for="season in seasons" :key="season.id" @click="expandSeason(season.id)" class="mb-2 flex justify-center">
          <button class="w-3/5 text-black py-2 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors">
            {{ season.title }}
          </button>
        </div>
        <div class="flex justify-center mb-4">
          <button class="w-3/5 text-black py-2 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors" @click="newSeasonForm = true">
            Create New Season
          </button>
        </div>
        <form v-if="expandedSeason || newSeasonForm" @submit.prevent="expandedSeason ? updateSeason() : createSeason()">
          <input v-model="seasonTitle" type="text" placeholder="Season title" required class="mb-2">
          <input v-model="seasonDescription" type="text" placeholder="Season description" required class="mb-2">
          <div class="flex justify-center">
            <button type="submit" class="w-3/5 text-black py-2 rounded-full bg-green-500 hover:bg-green-600 transition-colors">
              {{ expandedSeason ? 'Update Season' : 'Create Season' }}
            </button>
          </div>
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
      seasons: [],
      expandedSeason: null,
      newSeasonForm: false,
      seasonTitle: '',
      seasonDescription: '',
    };
  },
  created() {
    this.getSeasons();
  },
  methods: {
    expandSeason(seasonId) {
      this.expandedSeason = this.seasons.find(season => season.id === seasonId);
      this.seasonTitle = this.expandedSeason.title;
      this.seasonDescription = this.expandedSeason.description;
    },
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
      async updateSeason() {
    // Code to update the expandedSeason with the new seasonTitle and seasonDescription...
    this.expandedSeason = null;
    this.seasonTitle = '';
    this.seasonDescription = '';
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
