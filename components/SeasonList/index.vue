<template>
  <div class="fixed z-10 inset-0 overflow-y-auto" v-if="seasons || mode === 'practice'">
    <div class="flex items-center justify-center min-h-screen">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div class="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6 relative">
        <button @click="closeModal" class="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center z-15">
          X
        </button>
        <div v-if="mode === 'season'">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Add Practice to Season</h3>
          <h3 v-if="owner === user.id">You own this practice.</h3>
          <div v-for="season in seasons" :key="season.id" @click="addPracticeToSeason(season.id, $route.params.id)" class="mb-2 flex justify-center">
            <button class="w-3/5 text-black py-2 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors">
              {{ season.title }}
            </button>
          </div>
          <div class="flex justify-center my-4" v-if="seasons == null">
            No Existing Seasons Found :(
          </div>
          <div class="flex justify-center my-4" v-if="seasons">
            <span class="text-gray-600">or</span>
          </div>
          <div class="flex justify-center mb-4">
            <button class="w-3/5 text-black py-2 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors" @click="newSeasonForm = true" v-if="!newSeasonForm">
              Create New Season
            </button>
          </div>
          <form v-if="expandedSeason || newSeasonForm" @submit.prevent="expandedSeason ? updateSeason() : createSeason()">
            <input v-model="seasonTitle" type="text" placeholder="Season title" required class="mb-2 px-4 py-2 border border-gray-300 rounded">
            <input v-model="seasonDescription" type="text" placeholder="Season description" required class="mb-2 px-4 py-2 border border-gray-300 rounded">
            <div class="flex justify-center">
              <button type="submit" class="w-3/5 text-black py-2 rounded-full bg-green-500 hover:bg-green-600 transition-colors">
                {{ expandedSeason ? 'Update Season' : 'Create Season' }}
              </button>
            </div>
          </form>
        </div>
        <div v-else>
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Save Practice</h3>
          <EditableField :value="practiceTitle" @input="newValue => practiceTitle = newValue" />
          <div class="flex justify-center my-4">
            <button @click="saveAsPractice" class="w-3/5 text-white py-2 rounded-full bg-green-500 hover:bg-green-600 transition-colors">
              Save as Practice
            </button>
          </div>
        </div>
        <div class="flex justify-between my-4">
          <button @click="mode = 'season'" :class="mode === 'season' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'">Seasons</button>
          <button @click="mode = 'practice'" :class="mode === 'practice' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'">Practices</button>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import {mapGetters} from "vuex";

export default {
  props: ['owner', 'practiceID'],
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
      mode: 'season',
      practiceTitle: 'Your Practice Title Here',
    };
  },
  created() {
    this.getSeasons();
  },
  methods: {
    async addPracticeToSeason(seasonId, practiceId) {
      // Verify that seasonId and practiceId are provided
      if (!seasonId || !practiceId) {
        console.error('Season ID and/or Practice ID not provided');
        return;
      }

      // Get a reference to the season document in Firestore
      const seasonRef = this.$fire.firestore.collection('seasons').doc(seasonId);

      // Add the new practice ID to the practices array of the season
      try {
        await seasonRef.update({
          practices: this.$fireModule.firestore.FieldValue.arrayUnion(practiceId)
        });
        console.log('Practice added to season');
      } catch (error) {
        console.error('Error adding practice to season: ', error);
      }
    },
    closeModal() {
      this.$emit('close');
    },
    async createSeason() {
      if (this.seasonTitle.length >= 1 && this.seasonDescription) {
        const randomID = Math.floor(Math.random() * 10000);

        // Create a new season object
        const newSeason = {
          description: this.seasonDescription,
          id: randomID, // replace with a way to generate unique ID
          likes: 0,
          practices: [this.$route.params.id],
          title: this.seasonTitle,
          totalYardage: 900,
          userID: this.user.id // assuming this.user.id is available and refers to the current user's ID
        };

        // Add new season to Firestore
        try {
          await this.$fire.firestore.collection('seasons').add(newSeason);
          console.log('New season created');
        } catch (error) {
          console.error('Error creating new season: ', error);
        }
      }
      else {
        console.log('Error saving season: length of the title or description is too short.')
      }
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
