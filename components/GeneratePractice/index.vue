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
        <b-button variant="primary" :disabled="submitting" @click="submitPractice">
          <b-spinner small v-if="submitting"></b-spinner>
          {{ submitting ? 'Loading...' : 'Submit' }}
        </b-button>
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
      submitting: false,
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
      this.submitting = true;

      // Generate the practice request sentence
      let sentence = `Generate a swim practice for the pool type ${this.practice.poolSize}, the practice should be ${this.practice.distance} distance long, and focus on the following strokes ${this.practice.strokes.join(', ')} and allow the following equipment ${this.practice.equipment.join(', ')}. The title should have a creative name, and the userID should be ${this.user.id}. The ID should be a number between 100 and 12000.`;

      try {
        let response = await axios.post('https://genhppurl.mlabenski.repl.co/generate/practice', {
          input_text: sentence,
        });

        await this.$store.dispatch('notifications/addNotification', {message: `New practice created`, type: 2});
        this.$emit('input', false);
        this.resetPractice();

        // Navigate to the newly created practice
        await this.$router.push({name: 'id', params: {id: response.data}});

      } catch (error) {
        console.error('Error generating swim practice:', error);
      } finally {
        this.submitting = false;
      }
    },
    resetPractice() {
      this.practice = {
        distance: null,
        poolSize: null,
        duration: '',
        strokes: [],
        equipment: [],
      };
    },
  },
};
</script>
