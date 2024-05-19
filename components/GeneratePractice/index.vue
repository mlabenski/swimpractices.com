<template>
  <b-modal v-model="value" title="Generate Swim Practice" centered size="md" class="shadow-lg bg-gray-100 rounded-lg z-350" hide-footer>
    <div v-if="!user" class="p-5 bg-white rounded-lg shadow-sm text-center">
      <div class="mb-4">
        <h2 class="font-semibold text-xl text-gray-700">Join Us!</h2>
        <p class="text-gray-600 my-4">Create an account to start generating personalized swim practices.</p>
        <b-button @click="emitSignUpEvent" variant="primary" class="px-5 py-2 font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
          Sign Up Now
        </b-button>
      </div>
    </div>
    <div v-if="user" class="p-5 bg-white rounded-lg shadow-sm">
      <div class="mb-4 grid grid-cols-2 gap-4">
        <b-form-group label="Distance:" label-for="distance" class="font-semibold text-gray-700">
          <b-form-input v-model.number="practice.distance" id="distance" type="number" class="form-input block w-full sm:text-sm md:text-base border-gray-300"></b-form-input>
        </b-form-group>

        <b-form-group label="Pool Size:" label-for="poolSize" class="font-semibold text-gray-700">
          <b-form-select v-model="practice.poolSize" id="poolSize" class="form-input block w-full sm:text-sm md:text-base border-gray-300">
            <b-form-select-option value="25 meters">25 meters</b-form-select-option>
            <b-form-select-option value="50 meters">50 meters</b-form-select-option>
            <b-form-select-option value="25 yards">25 yards</b-form-select-option>
          </b-form-select>
        </b-form-group>
      </div>

      <b-form-group label="Duration:" label-for="duration" class="font-semibold text-gray-700">
        <b-form-input v-model="practice.duration" id="duration" type="time" class="form-input block w-full sm:text-sm md:text-base border-gray-300"></b-form-input>
      </b-form-group>

      <div class="mb-4">
        <!-- Strokes slider -->
        <b-form-group label="Acceptable Strokes:" label-for="strokes" class="font-semibold text-gray-700">
          <div v-for="stroke in allStrokes" :key="stroke" class="flex items-center my-2">
            <span class="text-sm text-gray-600 mr-3">{{ stroke }}</span>
            <b-form-slider v-model="strokePercentages[stroke]" @input="debouncedUpdateStrokePercentages(stroke)" :min=0 :max=100 variant="primary"></b-form-slider>
            <span class="text-sm ml-2">{{ strokePercentages[stroke] }}%</span>
          </div>
        </b-form-group>
      </div>

      <b-form-group label="Acceptable Equipment:" label-for="equipment" class="font-semibold text-gray-700">
        <div class="flex flex-wrap gap-2">
          <div v-for="item in equipmentItems" :key="item.name" @click="toggleEquipment(item.name)" :class="{'opacity-50': !practice.equipment.includes(item.name)}">
            <img :src="item.image" :alt="item.name" class="w-12 h-12 cursor-pointer">
            <b-form-checkbox v-model="practice.equipment" :value="item.name" class="d-none">{{ item.name }}</b-form-checkbox>
          </div>
        </div>
      </b-form-group>

      <div class="text-right mt-4">
        <b-button variant="primary" :disabled="submitting" @click="submitPractice" class="px-5 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg">
          <b-spinner small v-if="submitting"></b-spinner>
          {{ submitting ? 'Loading...' : 'Submit' }}
        </b-button>
      </div>
    </div>
  </b-modal>
</template>



<script>
import _ from 'lodash';
import axios from "axios";
import 'bootstrap-slider/dist/css/bootstrap-slider.css'
import bFormSlider from 'vue-bootstrap-slider/es/form-slider';
import { onMounted } from 'vue';
export default {
  components: {
    bFormSlider
  },
  props: ["user", "value"],
  data() {
    return {
      showModal: false,
      generatePracticeModal: false,
      submitting: false,
      practice: {
        distance: null,
        poolSize: null,
        duration: '',
        strokes: [],
        equipment: [],
      },
      allStrokes: ['fly', 'back', 'breast', 'freestyle'],
      strokePercentages: {
        'fly': 0,
        'back': 0,
        'breast': 0,
        'freestyle': 0
      },
      equipmentItems: [
        { name: 'fins', image: require('@/static/equipment/fins-image.png') },
        { name: 'snorkel', image: require('~/static/equipment/snorkel-image.png')},
        { name: 'paddles', image: require('~/static/equipment/paddle-image.png') },
        { name: 'pull boy', image: require('~/static/equipment/pull-boy-image.png') },
      ],
    };
  },
  watch: {
  },
  methods: {
    async submitPractice() {
      // Validate necessary fields
      if (!this.practice.distance || !this.practice.poolSize) {
        this.$buefy.notification.open({
          message: 'Please fill out all required fields',
          type: 'is-danger',
        });
        return;
      }

      this.submitting = true;

      // Construct detailed stroke and equipment information
      const strokeDetails = this.allStrokes.map(stroke => `${stroke}: ${this.strokePercentages[stroke]}%`).join(', ');
      const equipmentList = this.practice.equipment.join(', ');

      // Generate the practice request sentence with detailed information
      let sentence = `The last Practice you generated had distances distributed as 20% of the practice 50 yards, 60% of the practice 100 yards, the 20% of the practice 200 yards. Use those distributions as historical data so you do not write the same swim practice. The next practice should consist of at least 5 sets, with a mandatory 4 exercises per set. Generate a swim practice for a ${this.practice.poolSize}-meter pool, with a total distance of ${this.practice.distance} meters. Focus on the following strokes with their respective percentages [${strokeDetails}]. Allow the following equipment: [${this.practice.equipment.join(", ")}].`;

      let responseString = null;
      const requestData = {
        input_text: sentence,
        user_id: this.user.id // Make sure `user.id` is properly defined elsewhere in your component
      };

      console.log('Submitting prompt:', sentence);

      try {
        const response = await axios.post('https://genhppurl-mlabenski.replit.app/generate/v3/practice', requestData);
        const { data } = response;
        responseString = data.practice;
        console.log('The practice ID is:', data.practice_id);
        console.log('The response data is:', responseString);

        this.$emit('practice-generated', data.practice_id);
      } catch (error) {
        console.error('Error generating swim practice:', error);
      } finally {
        this.showModal = false;
        this.generatePracticeModal = false;
        this.submitting = false;
      }
    },

    updateStrokePercentages(stroke) {
      let activeStrokes = this.practice.strokes.filter(s => s !== stroke && this.allStrokes.includes(s));
      let remaining = 100 - this.strokePercentages[stroke];
      let perStroke = activeStrokes.length ? remaining / activeStrokes.length : 0;
      for (let s of activeStrokes) {
        this.strokePercentages[s] = perStroke;
      }
    },

    emitSignUpEvent() {
      // Emit an event for the parent component to handle
      this.$emit('sign-up-clicked');
    },

    debouncedUpdateStrokePercentages: _.debounce(function (changedStroke) {
      console.log('hello');
      this.updatedStrokePercentagesNew(changedStroke);
    }, 100),

    // Main logic to update stroke percentages
    updatedStrokePercentagesNew(changedStroke) {
      let totalPercentage = 0;

      // Calculate and round the total percentage first
      this.allStrokes.forEach(stroke => {
        totalPercentage += parseFloat(this.strokePercentages[stroke] || 0);
      });

      totalPercentage = Math.round(totalPercentage); // Round the total percentage after summing

      if (totalPercentage > 100) {
        let excess = totalPercentage - 100;
        let reductionShare = 0;
        let totalDistributablePercentage = 0;

        // Calculate total percentage that can be reduced from other strokes
        this.allStrokes.forEach(stroke => {
          if (stroke !== changedStroke && this.strokePercentages[stroke] > 0) {
            totalDistributablePercentage += this.strokePercentages[stroke];
          }
        });

        // Calculate the share of excess each stroke needs to give up
        this.allStrokes.forEach(stroke => {
          if (stroke !== changedStroke && this.strokePercentages[stroke] > 0) {
            reductionShare = (this.strokePercentages[stroke] / totalDistributablePercentage) * excess;
            reductionShare = Math.round(reductionShare); // Round each reduction share before applying
            // Ensure that no stroke goes negative and round the final percentage
            this.strokePercentages[stroke] = Math.max(Math.round(this.strokePercentages[stroke] - reductionShare), 0);
          }
        });
      }

      // Optionally round all percentages after adjustments
      this.allStrokes.forEach(stroke => {
        this.strokePercentages[stroke] = Math.round(this.strokePercentages[stroke]);
      });
    },
    toggleEquipment(itemName) {
      const index = this.practice.equipment.indexOf(itemName);
      if (index > -1) {
        this.practice.equipment.splice(index, 1);
      } else {
        this.practice.equipment.push(itemName);
      }
    }

  },
  created() {
    console.log("Component mounted and visible on the DOM");
    // Code to measure or log performance impact here
  }
};
</script>
