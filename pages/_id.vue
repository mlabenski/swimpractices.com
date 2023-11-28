<template>
  <div class="p-2 md:p-4 bg-gray-900 min-h-screen">
    <!-- START: Top Nav Bar -->
    <div class="fixed top-0 left-0 right-0 bg-gray-400 p-2 flex justify-between items-center shadow-md z-50 mb-25 sm:mb-0 sm:hidden">
      <router-link to="/" @click="isSeasonModalOpen = false" class="text-gray-800"><span class="material-icons">
          close
        </span></router-link>

      <div class="font-medium text-gray-800" v-if="practice">{{ practice.name }}</div>

      <button @click="isDropdownOpen = !isDropdownOpen" class="text-gray-800">
        <span class="material-icons">
          expand_more
        </span>
      </button>
    </div>

    <!-- START: Dropdown Menu -->
    <div v-if="isDropdownOpen" class="fixed top-12 left-0 right-0 bg-gray-400 p-2 flex flex-col space-y-2 shadow-md z-50 sm:hidden">
      <button
        @click="isSeasonModalOpen = true"
        class="px-3 py-2 bg-blue-400 text-white rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
      >
        Add to Profile
      </button>
      <button
        @click="isSeasonModalOpen = true"
        class="px-3 py-2 bg-orange-500 text-white rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
      >
        Add to Season
      </button>
      <button
        @click="isDropdownOpen = false"
        class="px-3 py-2 bg-blue-500 text-white rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
      >
        Close
      </button>
    </div>
    <div class="max-w-screen-sm mx-auto bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4"><div class="fixed right-0 mr-4" :class="{ 'sm:hidden': !isOptionsExpanded }">

      <div class="fixed right-0 bottom-0 m-4">
        <div class="flex flex-col items-center bg-white p-2 rounded shadow-lg" style="padding-bottom: 45px;">
          <button v-if="isOptionsExpanded" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded m-1" @click="zoomIn">Zoom In</button>
          <button v-if="isOptionsExpanded" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded m-1" @click="zoomOut">Zoom Out</button>
          <button v-if="isOptionsExpanded" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded m-1" @click="closeZoom">Close Zoom</button>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded m-1" @click="toggleOptions">{{ isOptionsExpanded ? 'Hide' : 'Options' }}</button>
        </div>
      </div>
    </div>
      <div class="px-2 md:px-6 py-2 md:py-4">
        <div v-if="!practice">Loading...</div>
        <div v-else>
          <div class="flex justify-between items-center mb-4 pt-12 sm:pt-0">
            <EditableField :templateNum=1 :value="practice.name" @input="newValue => practice.name = newValue"></EditableField>
              <div class="flex space-x-2">
              <button @click="toggleEditor" class="bg-transparent p-1 transform transition duration-500 ease-in-out hover:scale-110">
          <span class="material-icons text-white">
            {{ editorEnabled ? 'cancel' : 'edit' }}
          </span>
              </button>
              <button @click="savePractice" class="bg-transparent p-1 transform transition duration-500 ease-in-out hover:scale-110">
          <span class="material-icons text-white">
            save
          </span>
              </button>
            </div>
          </div>
          <div>
          </div>
          <div v-for="(set, setIndex) in practice.sets" :key="setIndex" class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <div>
                <LogsNotificationModel></LogsNotificationModel>
                  <EditableField :value="set.name" @input="newValue => set.name = newValue"></EditableField>
                  <button @click="toggleTableVisibility(setIndex)" class="mt-1 text-gray-500 text-xs md:text-sm">
                    {{ tableVisibility[setIndex] ? 'Expand' : 'Hide' }}
                  </button>
                <p class="mt-1 text-gray-500 text-xs md:text-sm">Set Topic: {{ set.description }}</p>
              </div>
              <div>
                <p class="mt-1 text-white font-bold text-xs md:text-sm">{{ set.numRounds }} round</p>
                <p class="mt-1 text-white font-bold text-xs md:text-sm">HR: {{ set.heartRate }}</p>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table v-if="!tableVisibility[setIndex]" class="table-auto w-full mt-2 text-gray-300 text-xs md:text-sm">
                <thead>
                <tr class="bg-gray-700">
                  <th class="px-2 md:px-4 py-1 md:py-2">Stroke</th>
                  <th class="px-2 md:px-4 py-1 md:py-2">Quantity</th>
                  <th class="px-2 md:px-4 py-1 md:py-2">Distance</th>
                  <th class="px-2 md:px-4 py-1 md:py-2">Description</th>
                  <th class="px-2 md:px-4 py-1 md:py-2">Equipment</th>
                  <th class="px-2 md:px-4 py-1 md:py-2">Interval</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(exercise, exerciseIndex) in set.exercises" :key="exerciseIndex">
                  <EditableField :value="exercise.stroke" @input="newValue => updateExercise('stroke', newValue, setIndex, exerciseIndex)"></EditableField>
                  <EditableField :value="exercise.quantity" @input="newValue => updateExercise('quantity', newValue, setIndex, exerciseIndex)"></EditableField>
                  <EditableField :value="exercise.distance" @input="newValue => updateExercise('distance', newValue, setIndex, exerciseIndex)"></EditableField>
                  <EditableField :value="exercise.description" @input="newValue => updateExercise('description', newValue, setIndex, exerciseIndex)"></EditableField>
                  <EditableField :value="exercise.equipment" @input="newValue => updateExercise('equipment', newValue, setIndex, exerciseIndex)"></EditableField>
                  <EditableField :value="exercise.interval" @input="newValue => updateExercise('interval', newValue, setIndex, exerciseIndex)"></EditableField>
                </tr>
                </tbody>
              </table>
              <button v-if="editorEnabled" @click="addExercise(setIndex)" class="mt-2 px-2 py-1 bg-green-500 text-white rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">
                Add Exercise below
              </button>
              <button v-if="editorEnabled" @click="addSet(setIndex)" class="mt-2 px-2 py-1 bg-green-500 text-white rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">
                Add Set below
              </button>
            </div>
          </div>
        </div>

          <div class="p-4 fixed inset-x-0 bottom-0 bg-gray-700 flex justify-between items-center sm:block hidden">
            <router-link to="/" class="px-2 md:px-3 py-1 md:py-2 bg-blue-500 text-white rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">Close</router-link>
          <button
            @click="isSeasonModalOpen = true"
            class="px-2 md:px-3 py-1 md:py-2 bg-blue-400 text-white rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          >
            Bookmark
          </button>
          <button
            @click="isSeasonModalOpen = true"
            class="px-2 md:px-3 py-1 md:py-2 bg-blue-400 text-white rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          >
            Add to Profile
          </button>
          <button
            @click="isSeasonModalOpen = true"
            class="px-2 md:px-3 py-1 md:py-2 bg-orange-500 text-white rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          >
            Add to Season
          </button>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EditableField from '@/components/EditableField/EditableField.vue';
import LogsNotificationModel from '@/components/LogsNotificationModel/index.vue';
import { mapGetters, mapActions } from "vuex";
import SeasonList from '@/components/SeasonList/index.vue';
export default {
  async asyncData({ params, app }) {
    const db = app.$fire.firestore;
    try {
      console.log('this is the param for the route:')
      console.log(params.id)
      const doc = await db.collection('practices').doc(params.id).get();
      console.log('logging db');
      console.log(db);
      console.log(doc);
      console.log(doc.data());
      if(!doc.exists) {
        throw new Error("This practice was not found!");
      }
      return { practice: doc.data() };
    } catch (error) {
      console.log('Error fetching practices: ', error);
      throw error;
    }
  },
  head() {
    const jsonLd = {
      "@context": "http://schema.org",
      "@type": "SportsEvent",
      "name": this.practice.name,
      "description": this.practice.review,
    }
    return {
      title: this.practice.name,
      meta: [
        { hid: 'description',
          name: 'description',
          content: `This is a swim practice with a total yardage of ${this.practice.totalYardage} and the title is ${this.practice.name}`
      },
      {
        hid: 'json-ld',
        type: 'application/ld+json',
        innerHTML: JSON.stringify(jsonLd)
      }
      ],
      link: [
        // Add this
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
        { rel: 'canonical', href:`https://www.swimpractices.com/${this.practice.id}`}
      ],
      script: [
      { type: 'application/ld+json', json: jsonLd }
      ],
      __dangerouslyDisableSanitizersByTagID: {
        'json-ld': ['innerHTML'] // This disables sanitization for the JSON-LD
      }
    }
  },
  components: {
    EditableField,
    SeasonList,
    LogsNotificationModel
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
      isLoading: 'getLoading',
    }),
  },
  data() {
    return {
      tableVisibility: {},
      isEditing: false,
      localValue: this.value,
      zoom: 1, // Add this
      isOptionsExpanded: false,
      isSeasonModalOpen: false,
      editorEnabled: false,
      isDropdownOpen: false
    }
  },
  watch: {
    value(newValue) {
    },
    isSeasonModalOpen(newValue) {
      if(newValue) {
        this.isDropdownOpen = false;
      }
    }
  },
  methods: {
    ...mapActions('practices', ['addExerciseToSet']),
    ...mapActions(["addPracticeToSeason", "createSeason"]),
    closeModal() {
      this.isSeasonModalOpen = false;
    },
    async fetchPractice() {
      console.log('the route is:' + this.$route.params.id);
      await this.$store.dispatch('practices/fetchPracticeByID', this.$route.params.id);
      this.practice = this.$store.state.practices.practice;
      console.log('the practice is:')
      console.log(this.practice);
    },
    toggleEditor() {
      this.editorEnabled = !this.editorEnabled;
    },
    generateRandomKey() {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    },
    async addToSeason(seasonID) {
      const practiceID = this.$route.params.id;
      await this.addPracticeToSeason({ seasonID, practiceID });
    },
    async createNewSeason(seasonData) {
      const seasonID = this.generateRandomKey();  // Implement this function to generate unique IDs
      await this.createSeason({ seasonID, seasonData });
    },
    addSet(setIndex) {
      const newSet = {
        favorites: 0,
        heartRate: '120-150',
        numRounds: 1,
        exercises: [{
          id: '19239181jro0',
          stroke: 'Enter stroke',
          quantity: 1,
          distance: 1,
          description: 'Enter description',
          equipment: 1,
          interval: 1
        }],
        name: 'New Set',
        description: 'New Set Description'
      };

      // Dispatch Vuex action
      this.$store.dispatch('practices/addOrUpdateSet', {
        practiceID: this.$route.params.id,
        setIndex,
        set: newSet
      });
    },
    async addExercise(setIndex) {
      const newExercise = {
        id: 'akf914141',
        stroke: 'Enter stroke',
        quantity: 1,
        distance: 1,
        description: 'Enter description',
        equipment: 1,
        interval: 1
      };
      console.log(this.practice);
      console.log('set Index hell')

      // Dispatch Vuex action
      await this.$store.dispatch('practices/addOrUpdateExerciseToSet', {
        practiceID: this.$route.params.id,
        setIndex,
        exercise: newExercise,
      }).then(r => this.fetchPractice());
    },
    updateExercise(property, newValue, setIndex, exerciseIndex) {
      console.log(`Updating ${property} to ${newValue} for setIndex ${setIndex} and exerciseIndex ${exerciseIndex}`);
      this.$store.dispatch('practices/addOrUpdateExerciseToSet', {
        practiceID: this.$route.params.id,
        setIndex: setIndex,
        exerciseIndex: exerciseIndex,
        property: property,
        newValue: newValue
      });
      //Now lets fetch the practice again to reload it??
    },
    toggleTableVisibility(setIndex) {
      this.$set(this.tableVisibility, setIndex, !this.tableVisibility[setIndex]);
    },
    updateExerciseStroke({ exercise, newValue }) {
      this.$store.dispatch('practices/updateExerciseStroke', { exerciseId: exercise.id, newValue });
    },
    async savePractice() {
      console.log('attempting to save');
      if (!this.user) {
        const error = 'guests are not allowed to save practices.'
        await this.$store.dispatch('notifications/addNotification', {message: 'Error updating practice: guests are not allowed to save practices', type: 3});
        return;
      }
      const practiceID = this.$route.params.id;
      const practice = this.$store.state.practices.practices.find(practice => practice.id === practiceID);
      console.log('We will only work with this new practice:')
      console.log(practice);

      // Check if user ID matches original
      if (practice.userID === this.user.id) {
        // Update existing practice
        try {
          await this.$fire.firestore.collection('practices').doc(practiceID).update(practice);
          await this.$store.dispatch('notifications/addNotification', {message: 'Practice saved successfully',type: 2})
        } catch (error) {
          await this.$store.dispatch('notifications/addNotification', {message: 'Error updating practice', type: 1});
        }
      } else {
        // If user ID does not match original, save as new practice
        // Replace user.id
        practiceData.userID = this.user.id;

        // Create a new document with a new ID
        try {
          const newPracticeRef = await this.$fire.firestore.collection('practices').add(practiceData);
          console.log('New practice saved with ID: ', newPracticeRef.id);
        } catch (error) {
          console.error('Error saving new practice: ', error);
        }
      }
    },
    zoomIn() {
      this.zoom += 0.1;
      document.body.style.transform = `scale(${this.zoom})`;
    },
    zoomOut() {
      if (this.zoom > 0.1) {
        this.zoom -= 0.1;
        document.body.style.transform = `scale(${this.zoom})`;
      }
    },
    closeZoom() {
      this.zoom = 1;
      document.body.style.transform = 'scale(1)';
    },
    toggleOptions() {
      this.isOptionsExpanded = !this.isOptionsExpanded;
    },
  },
  beforeDestroy() {
    this.closeZoom();
  },
};

</script>
