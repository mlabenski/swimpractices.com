<template>
  <b-modal v-model="value" title="Generate Swim Practice" centered size="md" class="shadow-lg">
    <div class="px-5 py-3 bg-white">
      <div class="mb-4 grid grid-cols-2 gap-4">
        <b-form-group label="Distance:" label-for="distance">
          <b-form-input v-model.number="practice.distance" id="distance" type="number" size="sm"></b-form-input>
        </b-form-group>

        <b-form-group label="Pool Size:" label-for="poolSize">
          <b-form-select v-model="practice.poolSize" id="poolSize" size="sm">
            <b-form-select-option value="25 meters">25 meters</b-form-select-option>
            <b-form-select-option value="50 meters">50 meters</b-form-select-option>
            <b-form-select-option value="25 yards">25 yards</b-form-select-option>
          </b-form-select>
        </b-form-group>
      </div>

      <b-form-group label="Duration:" label-for="duration">
        <b-form-input v-model="practice.duration" id="duration" type="time" size="sm"></b-form-input>
      </b-form-group>

      <b-form-group label="Acceptable Strokes:" label-for="strokes">
        <b-form-checkbox-group v-model="practice.strokes" id="strokes">
          <b-form-checkbox value="fly">Fly</b-form-checkbox>
          <b-form-checkbox value="back">Back</b-form-checkbox>
          <b-form-checkbox value="breast">Breast</b-form-checkbox>
          <b-form-checkbox value="freestyle">Freestyle</b-form-checkbox>
        </b-form-checkbox-group>
      </b-form-group>

      <b-form-group label="Acceptable Equipment:" label-for="equipment">
        <b-form-checkbox-group v-model="practice.equipment" id="equipment">
          <b-form-checkbox value="fins">Fins</b-form-checkbox>
          <b-form-checkbox value="snorkel">Snorkel</b-form-checkbox>
          <b-form-checkbox value="paddles">Paddles</b-form-checkbox>
          <b-form-checkbox value="pull boy">Pull Boy</b-form-checkbox>
          <b-form-checkbox value="parachute">Parachute</b-form-checkbox>
        </b-form-checkbox-group>
      </b-form-group>

      <div class="text-right mt-4">
        <b-button variant="primary" @click="submitPractice">Submit</b-button>
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
      let responseString = null;
      try {
        // Send a POST request to the API
        let response = await axios.post('https://genhppurl.mlabenski.repl.co/generate/practice', {
          input_text: sentence,
        });

        // Handle the API response here, e.g., display a success message
        responseString = response.data;
        console.log('the response data is ' + response.data);

      } catch (error) {
        // Handle the error, e.g., display an error message
        console.error('Error generating swim practice:', error);
      }

      // Close the modal
      await this.$store.dispatch('notifications/addNotification', {message: `New practice created ${responseString}`, type: 2});
      await this.$emit('input', false);
      this.showModal = false;
      this.generatePracticeModal = false;
    },
  },
};
</script>
