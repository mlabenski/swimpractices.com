<template>
  <div class="p-2 md:p-4 bg-gray-900 min-h-screen">
    <div class="max-w-screen-sm mx-auto bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4">
      <div class="px-2 md:px-6 py-2 md:py-4">
        <div class="font-bold text-lg md:text-xl mb-2 text-white">Practice Name: {{ practice.name }}</div>
        <div v-if="isLoading">Loading...</div>
        <div v-else>
          <div v-for="(set, setIndex) in practice.sets" :key="setIndex" class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <div>
                <h3 class="text-base md:text-lg font-semibold text-gray-300 flex items-center">
                  <EditableField :value="set.name" @input="newValue => set.name = newValue"></EditableField>
                  <button @click="toggleTableVisibility(setIndex)" class="mt-1 text-gray-500 text-xs md:text-sm">
                    {{ tableVisibility[setIndex] ? 'Expand' : 'Hide' }}
                  </button>
                </h3>
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
      practices: 'practices',
      userPractices: 'userPractices'
    }),
    ...mapGetters(['getLoading', 'getPracticeByID']),
    practice() {
      const practiceID = this.$route.params.id;
      return this.getPracticeByID(practiceID);
    },
  },
  data() {
    return {
      tableVisibility: {},
      isEditing: false,
      localValue: this.value
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
    }
  },
};
</script>
