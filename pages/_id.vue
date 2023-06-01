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
                  {{ set.name }}
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
                  <td class="border border-gray-700 px-2 md:px-4 py-1 md:py-2">{{ exercise.stroke }}</td>
                  <td class="border border-gray-700 px-2 md:px-4 py-1 md:py-2 text-lg md:text-xl">{{ exercise.quantity }}</td>
                  <td class="border border-gray-700 px-2 md:px-4 py-1 md:py-2 text-lg md:text-xl">{{ exercise.distance }}</td>
                  <td class="border border-gray-700 px-2 md:px-4 py-1 md:py-2">{{ exercise.description }}</td>
                  <td class="border border-gray-700 px-2 md:px-4 py-1 md:py-2">{{ exercise.equipment }}</td>
                  <td class="border border-gray-700 px-2 md:px-4 py-1 md:py-2 text-lg md:text-xl">{{ exercise.interval }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="flex justify-around bg-gray-700 p-2 fixed inset-x-0 bottom-0">
          <button class="px-2 md:px-3 py-1 md:py-2 bg-blue-500 text-white rounded">Close</button>
          <button class="px-2 md:px-3 py-1 md:py-2 bg-blue-500 text-white rounded">Share</button>
          <button class="px-2 md:px-3 py-1 md:py-2 bg-blue-500 text-white rounded">Save</button>
        </div>
        <router-link to="/" class="inline-block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Back to list
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getLoading', 'getPracticeByID']),
    practice() {
      const practiceID = this.$route.params.id;
      return this.getPracticeByID(practiceID);
    },
  },
  data() {
    return {
      tableVisibility: {},
    }
  },
  methods: {
    toggleTableVisibility(setIndex) {
      this.$set(this.tableVisibility, setIndex, !this.tableVisibility[setIndex]);
    },
  },
};
</script>
