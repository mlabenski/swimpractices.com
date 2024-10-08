<template>
  <div class="bg-gray-900 min-h-screen relative" v-if="practice">

    <!-- START: Top Nav Bar (Header Rows) -->
    <div class="sticky top-0 z-50">
      <!-- Row 1 -->
      <div class="bg-gray-400 p-2 flex justify-between items-center shadow-md">
        <a class="text-gray-800 material-icons" href="https://swimpractices.com">
          close
        </a>
        <div class="font-medium text-gray-800" v-if="practice">{{ practice.name }}</div>
        <!-- Placeholder for alignment. Can be removed if not needed -->
        <div class="opacity-0">
          <span class="material-icons">
            expand_more
          </span>
        </div>
      </div>
      <!-- Row 2 -->
      <div class="bg-gray-600 p-2 flex justify-center items-center shadow-md">
        <!-- Display set name of the current viewed set -->
        {{ currentSet ? currentSet.name : 'Set Name' }}
      </div>
      <!-- Row 3 -->
      <div class="bg-gray-600 p-2 flex justify-around items-center shadow-md">
        <!-- Dynamically set the active class based on the activeSet value -->
        <span
          v-for="n in practice.sets.length"
          :key="n"
          @click="scrollToSet(n-1)"
          :class="{ 'text-white': activeSet === n-1 }"
          class="cursor-pointer">
          {{ n }}
        </span>
      </div>
    </div>

    <!-- REST OF THE TEMPLATE (Adjusted for the new header) -->
    <div class="pt-2 pb-14">
      <div class="max-w-screen-lg mx-auto bg-gray-800 rounded-lg shadow-md pb-14 p-4 md:p-6">

        <div v-if="!practice" class="text-center text-gray-400 text-lg">
          Loading...
        </div>

        <div v-else>
          <div v-if="shouldShowNotification">
            <PendingPracticeNotification/>
          </div>
          <div v-for="(set, setIndex) in practice.sets" :key="setIndex" :ref="'set' + setIndex" class="mb-6">

            <!-- Set Header -->
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center">
                {{setIndex}}
                <LogsNotificationModel class="mr-2"></LogsNotificationModel>
                <EditableField
                  :value="set.name"
                  @input="newValue => set.name = newValue"
                  class="text-xl md:text-2xl font-bold text-gray-200">
                </EditableField>
              </div>
              <button @click="toggleTableVisibility(setIndex)" class="text-gray-400 hover:text-gray-500">
                {{ tableVisibility[setIndex] ? 'Expand' : 'Hide' }}
              </button>
            </div>

            <!-- Set Description with Rounds -->
            <div class="flex justify-between mb-4">
              <p class="text-gray-500 text-md">Set Topic: {{ set.description }}</p>
              <p class="text-white-50 text-md">Rds: x{{ set.numRounds }}</p>
            </div>


            <!-- Exercise Table -->
            <div class="bg-gray-700 rounded-lg">
              <table v-if="!tableVisibility[setIndex]" class="table-auto w-full text-gray-300 text-sm md:text-base">
                <thead>
                <tr>
                  <th class="px-4 py-2 font-semibold">Details</th>
                  <th class="px-4 py-2 font-semibold">Description</th>
                  <th class="px-4 py-2 font-semibold">Interval</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(exercise, exerciseIndex) in set.exercises" :key="exerciseIndex">
                  <td class="px-4 py-2 border-t">{{ exercise.quantity }}x{{ exercise.distance }}</td>
                  <td class="px-4 py-2 border-t">{{ exercise.description }}</td>
                  <td class="px-4 py-2 border-t">{{ exercise.interval }}</td>
                </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
        <div class="sticky-button-container">
          <button @click="togglePracticeStatus" class="start-practice-button">
            {{ isPracticeActive ? 'End This Practice' : 'Start This Practice' }}
          </button>
        </div>

      </div>
    </div>
    <client-only>
      <!-- <TopNavBar class="top-nav-bar-class" :user="user ? user.id : null" @startPractice="startPractice" @openSignup="openSignup" @logout="logout"/> -->
    </client-only>
  </div>
</template>



<script>
import EditableField from '@/components/EditableField/EditableField.vue';
import LogsNotificationModel from '@/components/LogsNotificationModel/index.vue';
import TopNavBar from '@/components/TopNavBar'
import { mapGetters, mapActions } from "vuex";
import SeasonList from '@/components/SeasonList/index.vue';
import PendingPracticeNotification from "@/components/PendingPracticeNotification/PendingPracticeNotification.vue";
export default {
  async asyncData({ params, app }) {
    const db = app.$fire.firestore;
    try {
      const doc = await db.collection('practices').doc(params.id).get();
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
          content: `This is a swim practice with a total yardage of ${this.practice.totalYardage} and the title is ${this.practice.name}`,
      },
      {
        hid: 'json-ld',
        type: 'application/ld+json',
        innerHTML: JSON.stringify(jsonLd)
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes'
      },
      // Mobile-Optimized Content
      {
        name: 'mobile-optimized',
        content: 'width'
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
    LogsNotificationModel,
    TopNavBar,
    PendingPracticeNotification
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
      isLoading: 'getLoading',
    }),
    shouldShowNotification() {
      const currentPracticeId = this.$route.params.id;  // Assuming the route param name is 'id'
      const storedPracticeId = localStorage.getItem('pendingPractice');
      return currentPracticeId !== storedPracticeId;
    }
  },
  data() {
    return {
      isPracticeActive: false,
      tableVisibility: {},
      isEditing: false,
      localValue: this.value,
      zoom: 1, // Add this
      isOptionsExpanded: false,
      isSeasonModalOpen: false,
      editorEnabled: false,
      isDropdownOpen: false,
      practice: null,
      activeSet: 1,
      currentSet: null
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
      console.log('the route is:' + this.$route.params.idtwotwo);
      await this.$store.dispatch('practices/fetchPracticeByID', this.$route.params.idtwo);
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
      const practiceID = this.$route.params.idtwo;
      await this.addPracticeToSeason({ seasonID, practiceID });
    },
    async createNewSeason(seasonData) {
      const seasonID = this.generateRandomKey();  // Implement this function to generate unique IDs
      await this.createSeason({ seasonID, seasonData });
    },
    togglePracticeStatus() {
      if (this.isPracticeActive) {
        this.endPractice();
      } else {
        this.isPracticeActive = true;
        this.savePracticeToCache();
      }
    },
    savePracticeToCache() {
      if (this.practice) {
        const practiceIdToSave = this.practice.id;
        window.localStorage.setItem('pendingPractice', practiceIdToSave);
        console.log('User has elected to perform this practice');
        console.log(practiceIdToSave);
      } else {
        console.error('No practice to save.');
      }
    },
    async endPractice() {
      this.isPracticeActive = false;
      const practiceId = this.practice.id;
      const endTime = new Date(); // Create a new Date object for the current datetime

      // Remove from local storage or similar clean-up
      window.localStorage.removeItem('pendingPractice');
      console.log('Practice ended:', practiceId);

      // Firestore update using query
      if (this.user && this.user.id) {
        try {
          const usersRef = this.$fire.firestore.collection('users');
          const querySnapshot = await usersRef.where('user_id', '==', this.user.id).get();

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0]; // assuming there's one match
            const arrayUnion = this.$fireModule.firestore.FieldValue.arrayUnion; // Correctly accessing arrayUnion
            await userDoc.ref.update({
              practices: arrayUnion({
                id: practiceId,
                endedAt: this.$fireModule.firestore.Timestamp.fromDate(endTime) // Firestore server timestamp for consistency
              })
            });
            console.log('Firestore updated with practice ID and end time for user:', this.user.id);
          } else {
            console.log('No user found with ID:', this.user.id);
          }
        } catch (error) {
          console.error('Error querying Firestore:', error);
        }
      } else {
        console.error('User not logged in or invalid user ID.');
      }
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
        practiceID: this.$route.params.idtwo,
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
        practiceID: this.$route.params.idtwo,
        setIndex,
        exercise: newExercise,
      }).then(r => this.fetchPractice());
    },
    updateExercise(property, newValue, setIndex, exerciseIndex) {
      console.log(`Updating ${property} to ${newValue} for setIndex ${setIndex} and exerciseIndex ${exerciseIndex}`);
      this.$store.dispatch('practices/addOrUpdateExerciseToSet', {
        practiceID: this.$route.params.idtwo,
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
      const practiceID = this.$route.params.idtwo;
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
    scrollToSet(setNumber) {
      const setElement = this.$refs['set' + setNumber];
      if (setElement && setElement[0]) {
        setElement[0].scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        console.warn(`Ref for set ${setNumber} not found.`);
      }
    },
    checkPendingPractice() {
      const practiceId = localStorage.getItem('pendingPractice');
      if (practiceId) {
        this.pendingPracticeExists = true;
        this.isPracticeActive = true;
        this.practiceId = practiceId;
        console.log('Pending practice id:', this.practiceId);
      } else {
        this.pendingPracticeExists = false;
        this.practiceId = null;
      }
    },
    closeAndNavigate() {
      //this.$router.push("/");
   },
   goHome() {
  // Navigate to the home page
  this.$router.push({ path: '/' });
  },
    checkActiveSet() {
      // Logic to determine which set is currently in view
      for (let i = 0; i < this.practice.sets.length; i++) {
        const refKey = 'set' + i;
        if (this.$refs[refKey] && this.$refs[refKey].length > 0) {
          const setElement = this.$refs[refKey][0];
          const top = setElement.getBoundingClientRect().top;
          const bottom = setElement.getBoundingClientRect().bottom;

          if (top <= window.innerHeight / 2 && bottom >= window.innerHeight / 2) {
            this.activeSet = i;
            this.currentSet = this.practice.sets[i];
            break;
          }
        } else {
          console.warn(`Ref ${refKey} not found or has no elements.`);
        }
      }
    }
  },
  mounted() {
    this.checkPendingPractice();
    //window.addEventListener('scroll', this.checkActiveSet);
  },
  beforeDestroy() {
    this.closeZoom();
    window.removeEventListener('scroll', this.checkActiveSet);
  },
}

</script>

<style>
.sticky-button-container {
  position: fixed; /* Fixed positioning to make it stick to the viewport */
  bottom: 0; /* Align to the bottom */
  left: 0; /* Align to the left */
  width: 100%; /* Full width */
  background-color: rgba(17,24,39, 0.3);  /* Optional: background color for the button container */
  text-align: center; /* Center the button inside the container */
  padding: 10px 0; /* Padding for aesthetic spacing */
  z-index: 1000; /* High z-index to ensure it's above other content */
}

.start-practice-button {
  background-color: #007BFF; /* Bootstrap primary blue */
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.start-practice-button:hover {
  background-color: #0056b3; /* Darker blue on hover */
}
.min-h-screen {
  padding-bottom: 60px; /* Adjust based on your button's height */
}
</style>
