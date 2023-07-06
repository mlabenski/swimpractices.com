<template>
  <b-modal v-model="value" title="Generate Swim Practice" centered ok-only ok-variant="primary">
    <div class="p-4 bg-white rounded shadow-xl">
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-gray-700" for="distance">Distance:</label>
          <input v-model.number="practice.distance" id="distance" type="number" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>

        <div>
          <label class="block text-gray-700" for="poolSize">Pool Size:</label>
          <b-form-select v-model="practice.poolSize" id="poolSize" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <option value="25 meters">25 meters</option>
            <option value="50 meters">50 meters</option>
            <option value="25 yards">25 yards</option>
          </b-form-select>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700" for="duration">Duration:</label>
        <input v-model="practice.duration" id="duration" type="time" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">Acceptable Strokes:</label>
        <b-form-checkbox-group v-model="practice.strokes" id="strokes">
          <b-form-checkbox value="fly">Fly</b-form-checkbox>
          <b-form-checkbox value="back">Back</b-form-checkbox>
          <b-form-checkbox value="breast">Breast</b-form-checkbox>
          <b-form-checkbox value="freestyle">Freestyle</b-form-checkbox>
        </b-form-checkbox-group>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">Acceptable Equipment:</label>
        <b-form-checkbox-group v-model="practice.equipment" id="equipment">
          <b-form-checkbox value="fins">Fins</b-form-checkbox>
          <b-form-checkbox value="snorkel">Snorkel</b-form-checkbox>
          <b-form-checkbox value="paddles">Paddles</b-form-checkbox>
          <b-form-checkbox value="pull boy">Pull Boy</b-form-checkbox>
          <b-form-checkbox value="parachute">Parachute</b-form-checkbox>
        </b-form-checkbox-group>
      </div>

      <div class="text-right">
        <b-button variant="success" class="text-black hover:text-black focus:text-black" @click="submitPractice">Submit</b-button>

      </div>
    </div>
  </b-modal>
</template>


<script>
import axios from 'axios';

export default {
  props: ["user", "value"],
  data() {
    return {
      showModal: false,
      generatePracticeModal: false,
      practice: {
        distance: null,
        poolSize: null,
        duration: '',
        strokes: [],
        equipment: [],
      },
    };
  },
  methods: {
    async submitPractice() {
      // Generate the practice request sentence
      let sentence = `Generate a swim practice for the pool type ${this.practice.poolSize}, the practice should be ${this.practice.distance} long, and focus on the following strokes ${this.practice.strokes.join(', ')} and allow the following equipment ${this.practice.equipment.join(', ')}. The title should have a creative name, and the userID should be ${this.user}. The ID should be a number between 100 and 12000.`;

      try {
        // Send a POST request to the API
        let response = await axios.post('https://genhppurl.mlabenski.repl.co/generate/practice', {
          input_text: sentence,
        });

        // Handle the API response here, e.g., display a success message
        console.log(response.data);

      } catch (error) {
        // Handle the error, e.g., display an error message
        console.error('Error generating swim practice:', error);
      }

      // Close the modal
      this.showModal = false;
      this.generatePracticeModal = false;
      this.$emit('input', false);
    },
  },
};
</script>
