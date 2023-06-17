<template>
  <div class="p-2 md:p-4 bg-gray-900 min-h-screen">
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
          <EditableField :templateNum=1 :value="practice.name" @input="newValue => practice.name = newValue"></EditableField>
          <div v-for="(set, setIndex) in practice.sets" :key="setIndex" class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <div>
                <h3 class="text-base md:text-lg font-semibold text-gray-300 flex items-center">
                  <EditableField :value="set[setIndex].name" @input="newValue => set[setIndex].name = newValue"></EditableField>
                  <button @click="toggleTableVisibility(setIndex)" class="mt-1 text-gray-500 text-xs md:text-sm">
                    {{ tableVisibility[setIndex] ? 'Expand' : 'Hide' }}
                  </button>
                </h3>
                <p class="mt-1 text-gray-500 text-xs md:text-sm">Set Topic: {{ set[setIndex].description }}</p>
              </div>
              <div>
                <p class="mt-1 text-white font-bold text-xs md:text-sm">{{ set[setIndex].numRounds }} round</p>
                <p class="mt-1 text-white font-bold text-xs md:text-sm">HR: {{ set[setIndex].heartRate }}</p>
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
                <tr v-for="(exercise, exerciseIndex) in set[setIndex].exercises" :key="exerciseIndex">
                  <EditableField :value="exercise.stroke" @input="newValue => exercise.stroke = newValue"></EditableField>
                  <EditableField :value="exercise.quantity" @input="newValue => exercise.quantity = newValue"></EditableField>
                  <EditableField :value="exercise.distance" @input="newValue => exercise.distance = newValue"></EditableField>
                  <EditableField :value="exercise.description" @input="newValue => exercise.description = newValue"></EditableField>
                  <EditableField :value="exercise.equipment" @input="newValue => exercise.equipment = newValue"></EditableField>
                  <EditableField :value="exercise.interval" @input="newValue => exercise.interval = newValue"></EditableField>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
          <div class="p-4 fixed inset-x-0 bottom-0 bg-gray-700">
            <router-link to="/" class="px-2 md:px-3 py-1 md:py-2 bg-blue-500 text-white rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">Close</router-link>
            <button @click="savePractice" class="px-2 md:px-3 py-1 md:py-2 bg-green-500 text-white rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">Save</button>
            <button @click="deleteDraft" v-if="isEditing" class="px-2 md:px-3 py-1 md:py-2 bg-red-500 text-white rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">Delete Draft</button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import EditableField from '@/components/EditableField/EditableField.vue';
import { mapGetters } from "vuex";

export default {
  components: {
    EditableField,
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
      getPracticeByID: 'getPracticeByID',
      isLoading: 'getLoading',
    }),
    practice() {
      return this.getPracticeByID(this.$route.params.id);
    },
  },
  data() {
    return {
      tableVisibility: {},
      isEditing: false,
      localValue: this.value,
      zoom: 1, // Add this
      isOptionsExpanded: false,
    }
  },
  watch: {
    value(newValue) {

    },
  },
  methods: {
    toggleTableVisibility(setIndex) {
      this.$set(this.tableVisibility, setIndex, !this.tableVisibility[setIndex]);
    },
      async savePractice() {
      const practiceID = this.$route.params.id;
      const practiceRef = this.$fire.firestore.collection('practices').doc(practiceID);

      // Get current practice data
      const practiceData = this.practice;

    // Check if user ID matches original
    if (practiceData.userID === this.user.id) {
      // Update existing practice
      try {
        await this.$fire.firestore.collection('practices').doc(practiceID).update(practiceData);
        console.log('Practice updated');
      } catch (error) {
        console.error('Error updating practice: ', error);
      }
    } else {
      // If user ID does not match original, save as new practice
      // Replace user.id
      practiceData.user.id = currentUserId;

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
