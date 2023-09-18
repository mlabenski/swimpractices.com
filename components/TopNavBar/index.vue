<template>
  <b-modal v-model="value" title="Generate Swim Practice" centered size="md" class="shadow-lg bg-gray-100 rounded-lg z-350" no-close-on-backdrop no-close-on-esc>
    <div v-if="!user" class="p-5 bg-white rounded-lg shadow-sm">
      <div class="mb-4 grid grid-cols-2 gap-4">
        <h2 class="font-semibold text-lg text-gray-700">Sorry! Create an account to generate a practice.</h2>
      </div>
    </div>
    
    <b-form @submit.prevent="submitPractice" v-if="user" class="p-5 bg-white rounded-lg shadow-sm">
      <div class="mb-4 grid grid-cols-2 gap-4">
        <b-form-group label="Distance:" label-for="distance" class="font-semibold text-gray-700">
          <b-form-input v-model.number="practice.distance" id="distance" type="number" required class="form-input block w-full sm:text-sm md:text-base border-gray-300"></b-form-input>
        </b-form-group>

        <b-form-group label="Pool Size:" label-for="poolSize" class="font-semibold text-gray-700">
          <b-form-select v-model="practice.poolSize" id="poolSize" required class="form-input block w-full sm:text-sm md:text-base border-gray-300">
            <b-form-select-option value="25 meters">25 meters</b-form-select-option>
            <b-form-select-option value="50 meters">50 meters</b-form-select-option>
            <b-form-select-option value="25 yards">25 yards</b-form-select-option>
          </b-form-select>
        </b-form-group>
      </div>

      <b-form-group label="Duration:" label-for="duration" class="font-semibold text-gray-700">
        <b-form-input v-model="practice.duration" id="duration" type="time" class="form-input block w-full sm:text-sm md:text-base border-gray-300"></b-form-input>
      </b-form-group>

      <b-form-group label="Acceptable Strokes:" label-for="strokes" class="font-semibold text-gray-700">
        <b-form-checkbox-group v-model="practice.strokes" id="strokes" required class="flex flex-wrap gap-2">
          <div v-for="stroke in allStrokes" :key="stroke">
            <b-form-checkbox :value="stroke" class="text-sm text-gray-600">{{ stroke }}</b-form-checkbox>
            <b-form-input v-model.number="strokePercentages[stroke]" type="number" min="0" max="100" @change="updateStrokePercentages(stroke)" class="ml-2 w-20 form-input text-sm text-gray-600"></b-form-input>
            <span class="text-sm ml-1">%</span>
          </div>
        </b-form-checkbox-group>
      </b-form-group>

      <b-form-group label="Difficulty Level:" label-for="difficulty" class="font-semibold text-gray-700">
        <b-form-slider v-model="practice.difficulty" id="difficulty" min="1" max="4" step="1" ticks ticks-labels="['Easy', 'Moderate', 'Hard', 'Very Hard']"></b-form-slider>
      </b-form-group>

      <b-form-group label="Acceptable Equipment:" label-for="equipment" class="font-semibold text-gray-700">
        <b-form-checkbox-group v-model="practice.equipment" id="equipment" class="flex flex-wrap gap-2">
          <b-form-checkbox value="fins" class="text-sm text-gray-600">Fins</b-form-checkbox>
          <b-form-checkbox value="snorkel" class="text-sm text-gray-600">Snorkel</b-form-checkbox>
          <b-form-checkbox value="paddles" class="text-sm text-gray-600">Paddles</b-form-checkbox>
          <b-form-checkbox value="pull boy" class="text-sm text-gray-600">Pull Boy</b-form-checkbox>
          <b-form-checkbox value="parachute" class="text-sm text-gray-600">Parachute</b-form-checkbox>
        </b-form-checkbox-group>
      </b-form-group>

      <div class="text-right mt-4">
        <b-button type="submit" variant="primary" :disabled="submitting" class="px-5 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg">
          <b-spinner small v-if="submitting"></b-spinner>
          {{ submitting ? 'Loading...' : 'Submit' }}
        </b-button>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
export default {
  data() {
    return {
      value: false,
      user: true, // Note: update this according to your actual user authentication logic
      submitting: false,
      practice: {
        distance: null,
        poolSize: null,
        duration: null,
        strokes: [],
        difficulty: 1,
        equipment: [],
      },
      allStrokes: ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly'],
      strokePercentages: {
        Freestyle: null,
        Backstroke: null,
        Breaststroke: null,
        Butterfly: null,
      },
    };
  },
  methods: {
    async submitPractice() {
      if (!this.practice.distance || !this.practice.poolSize || !this.practice.strokes.length) {
        this.$buefy.notification.open({
          message: 'Please fill out all required fields',
          type: 'is-danger',
        });
        return;
      }

      // Update this with your actual form submission logic
      this.submitting = true;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      this.submitting = false;
    },
    updateStrokePercentages(stroke) {
      // Optional: add logic to handle changes in stroke percentages
    },
  },
};
</script>

<style scoped>
.form-input {
  border: 1px solid #d2d6dc;
}
</style>
