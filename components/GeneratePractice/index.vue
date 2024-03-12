<template>
  <b-modal v-model="value" title="Generate Swim Practice" centered size="md" class="shadow-lg bg-gray-100 rounded-lg z-350" hide-footer>
    <div v-if="!user" class="p-5 bg-white rounded-lg shadow-sm">
      <div class="mb-4 grid grid-cols-2 gap-4">
        <h2 class="font-semibold text-lg text-gray-700">Sorry! Create an account to generate a practice.</h2>
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

      <b-form-group label="Acceptable Strokes:" label-for="strokes" class="font-semibold text-gray-700">
        <b-form-checkbox-group v-model="practice.strokes" id="strokes" class="flex flex-wrap gap-2">
          <div v-for="stroke in allStrokes" :key="stroke">
            <b-form-checkbox :value="stroke" class="text-sm text-gray-600">{{ stroke }}</b-form-checkbox>
            <b-form-input v-model.number="strokePercentages[stroke]" type="number" min="0" max="100"
                          @change="updateStrokePercentages(stroke)" class="ml-2 w-20 form-input text-sm text-gray-600">
            </b-form-input>
            <span class="text-sm ml-1">%</span>
          </div>
        </b-form-checkbox-group>
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
        <b-button variant="primary" :disabled="submitting" @click="submitPractice" class="px-5 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg">
          <b-spinner small v-if="submitting"></b-spinner>
          {{ submitting ? 'Loading...' : 'Submit' }}
        </b-button>
      </div>
    </div>
  </b-modal>
</template>



<script>
export default {
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
      }
    };
  },
  watch: {
    'practice.strokes': {
      handler: function(newStrokes) {
        let activeStrokes = newStrokes.filter(stroke => this.allStrokes.includes(stroke));
        let perStroke = 100 / activeStrokes.length;
        for (let stroke of this.allStrokes) {
          this.strokePercentages[stroke] = activeStrokes.includes(stroke) ? perStroke : 0;
        }
      },
      immediate: true,
      deep: true
    }
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
      this.submitting = true;
      // Generate the practice request sentence
      //Adding a comment to force commit
      // Still no register
      let sentence = `Generate a swim practice that consists of exercises with a total distance of ${this.practice.distance} for the pool type ${this.practice.poolSize}, and focus on the following strokes ${this.practice.strokes.join(', ')} and allow the following equipment ${this.practice.equipment.join(', ')}. Use your text generation skills to create a meaningful practice, and the userID should be ${this.user.id}. The ID should be a number between 100 and 12000.`;
      let responseString = null;
      const requestData = {
        input_text: sentence,
        user_id: this.user.id

      }
      console.log('submitting prompt: '+sentence)
      try {
        const response = await axios.post('https://genhppurl-mlabenski.replit.app/generate/v2/practice', requestData);
        const { data } = response;
        // Handle the API response here, e.g., display a success message
        responseString = data.practice;
        console.log('the response data is ' + responseString);

      } catch (error) {
        // Handle the error, e.g., display an error message
        console.error('Error generating swim practice:', error);
      }
      finally {
        await this.$emit('input', false);
        // assuming responseString is your new practice ID
        this.showModal = false;
        this.generatePracticeModal = false;
        this.submitting = false;
        this.$emit('practice-generated', responseString);
      }
    },
    updateStrokePercentages(stroke) {
      let activeStrokes = this.practice.strokes.filter(s => s !== stroke && this.allStrokes.includes(s));
      let remaining = 100 - this.strokePercentages[stroke];
      let perStroke = activeStrokes.length ? remaining / activeStrokes.length : 0;
      for (let s of activeStrokes) {
        this.strokePercentages[s] = perStroke;
      }
    }
  },
};
</script>
