<template>
  <div>
    <div class="container mx-auto px-4 py-2">
      <h1 class="text-4xl font-bold mb-4 pt-2">Swim Practice</h1>

      <div class="flex flex-col sm:flex-row justify-center">
        <button @click="startEmptyPractice" class="w-full sm:w-auto mx-1 mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Start an Empty Practice</button>
        <button @startPractice="startPractice" @click="openModal"  class="w-full sm:w-auto mx-1 mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">AI Generate Set</button>
      </div>
      <GenerateSetModel v-if="isModalOpen" @close="closeModal" />
      <div class="grid sm:grid-cols-2 grid-cols-1 gap-4">
        <div>
          <h3 class="text-lg font-bold mb-2">My Templates</h3>
          <SetList title="My Templates" :practiceSets="userPractices"></SetList>
          <div v-if="practiceData">
            <h2 class="text-2xl font-bold mb-4">Generated Practice</h2>
            <pre>{{ practiceData }}</pre>
          </div>
          <!-- Display your custom templates here -->
        </div>
        <div>
          <h3 class="text-lg font-bold mb-2">Recommended Templates</h3>
          <SetList title="Recommended Templates" :practiceSets="practices"></SetList>
          <!-- Display recommended templates here -->
        </div>
      </div>
      <div class="grid sm:grid-cols-2 grid-cols-1 gap-4">

          <h3 class="text-lg font-bold mb-2">Manual Practice Entry</h3>
          <textarea v-model="pastedPractice" rows="10" cols="50" placeholder="Paste the practice JSON here"></textarea>
          <button @click="submitPractice">Submit Practice</button>
      </div>
  </div>

    <nav class="fixed bottom-0 w-full bg-gray-900 text-white px-4 py-2">
      <div class="container mx-auto">
        <div class="flex justify-between">
          <a href="#" class="flex items-center">
            <svg class="w-6 h-6 fill-current mr-2" viewBox="0 0 24 24">
              <!-- Add your icon here -->
            </svg>
            <span>Profile</span>
          </a>
          <a href="#" class="flex items-center">
            <svg class="w-6 h-6 fill-current mr-2" viewBox="0 0 24 24">
              <!-- Add your icon here -->
            </svg>
            <span>History</span>
          </a>
          <a href="#" class="flex items-center">
            <svg class="w-6 h-6 fill-current mr-2" viewBox="0 0 24 24">
              <!-- Add your icon here -->
            </svg>
            <span>Start Practice</span>
          </a>
          <a href="#" class="flex items-center">
            <svg class="w-6 h-6 fill-current mr-2" viewBox="0 0 24 24">
              <!-- Add your icon here -->
            </svg>
            <span>Exercises</span>
          </a>
          <a href="#" class="flex items-center" @click.prevent="openSignup">
            <a class="w-6 h-6 fill-current mr-2" viewBox="0 0 24 24">
              <span class="material-icons ">face</span>
            </a>
            <span>Upgrade</span>
          </a>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import GenerateSetModel from '@/components/GenerateSetModel';
import SetList from '@/components/SetList/SetList.vue';
import practiceSets from '@/data/practiceSetsNew.js';
import { mapGetters, mapActions } from "vuex";

export default {
  head () {
    return {
      link: [
        // Add this
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
      ],
    }
  },
  components: {
    GenerateSetModel,
    SetList
  },
  async mounted() {
    try {
      await this.$store.dispatch('bindPractices');
      await this.$store.dispatch('bindUserPractices');
    } catch (e) {
      console.error(e)
    }
  },
  data() {
    return {
      isModalOpen: false,
      practiceSets,
      pastedPractice: '',
      practiceData: null
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      practices: 'practices',
      userPractices: 'userPractices'
    }),
  },
  methods: {
    ...mapActions({
      openLogin: 'auth/openLogin',
      openSignup: 'auth/openSignup',
      logout: 'auth/logout'
    }),
    startEmptyPractice() {
    // Logic to start an empty practice
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
    this.isModalOpen = false;
    },
    startPractice(practiceData) {
      console.log('emitted back to the main index');
      console.log(practiceData);
      this.practiceData = practiceData;
    },
    async submitPractice() {
      try {
        const practiceData = JSON.parse(this.pastedPractice); // Parse the JSON input

        // Submit the practice data to Firestore
        await this.$fire.firestore.collection('practices').add(practiceData);

        // Optional: Reset the input field or do any other necessary actions
        this.pastedPractice = '';
      } catch (error) {
        console.error('Error submitting practice:', error);
        // Handle the error, e.g., display an error message
      }
    }
  }
}
</script>

<style>
.container {
  padding-left: 1em;
  padding-right: 1em;

}
html {
  background-color: lightgrey;
}
</style>
