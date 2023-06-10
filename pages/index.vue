<template>
<div>
    <div class="container mx-auto px-4 py-2">
      <h1 class="text-4xl font-bold mb-4 pt-2">Swim Practice</h1>

      <div class="flex flex-col sm:flex-row justify-center">
        <GenerateSetModel v-if="isModalOpen" @close="closeModal" />
      </div>
      <div class="grid sm:grid-cols-2 grid-cols-1 gap-4">
        <div class="grid sm:grid-cols-2 grid-cols-1 gap-4 relative">
          <div>
            <SetList title="My Templates" :userID="user ? user.id : null"  :practiceSets="userPractices"></SetList>
            <div v-if="practiceData">
              <h2 class="text-2xl font-bold mb-4">Generated Practice</h2>
              <pre>{{ practiceData }}</pre>
            </div>
            <!-- Display your custom templates here -->
          </div>
          <div v-if="!user" class="absolute inset-0 bg-gray-900 bg-opacity-45 flex items-center justify-center z-50">
          <p class="text-white text-2xl" @click="openSignup">Log in to save practices</p>
          </div>
        </div>
        <div>
          <SetList title="Recommended Templates" :practiceSets="practices" :userID="user ? user.id : null" ></SetList>
          <!-- Display recommended templates here -->
        </div>
        <div>
          <h2 class="text-2xl font-bold mb-4">Featured Seasons</h2>
          <!-- Display recommended templates here -->
          <div class="flex flex-wrap">
            <SeasonCards v-for="season in seasonSet" :key="season.seasonID" :season="season" />
          </div>
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
        <a class="flex flex-col items-center" @startPractice="startPractice" @click="openModal"  >
          <span class="material-icons w-6 h-6 fill-current mb-2">school</span>
          <span>Create</span>
        </a>
        <a href="#" class="flex flex-col items-center">
          <span class="material-icons w-6 h-6 fill-current mb-2">pool</span>
          <span>View</span>
        </a>
        <a href="#" class="flex flex-col items-center" @click.prevent="openSignup">
          <span class="material-icons w-6 h-6 fill-current mb-2">lock_open</span>
          <span>Log In</span>
        </a>
      </div>
    </div>
  </nav>
  </div>
</template>

<script>
import GenerateSetModel from '@/components/GenerateSetModel';
import SetList from '@/components/SetList/SetList.vue';
import SeasonCards from "@/components/SeasonCards/index.vue";
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
    SetList,
    SeasonCards
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
      practiceData: null,
      seasonSet: [
        {
          seasonID: "S01",
          userID: "U01",
          setIDs: ["set1", "set2", "set3"],
          description: "Sets from Villanova Swimming",
          title: "Villanova",
          totalYardage: 34000
        },
        {
          seasonID: "S02",
          userID: "U01",
          setIDs: ["set4", "set5", "set6"],
          description: "Swim the distance of an Iron man 77 miles",
          title: "Iron Man Challenge",
          totalYardage: 7500
        },
        {
          seasonID: "S03",
          userID: "U02",
          setIDs: ["set7", "set8", "set9"],
          description: "This is season set 3",
          title: "Season Set 3",
          totalYardage: 9200
        },
        {
          seasonID: "S04",
          userID: "U02",
          setIDs: ["set10", "set11", "set12"],
          description: "This is season set 4",
          title: "Season Set 4",
          totalYardage: 8800
        },
        {
          seasonID: "S05",
          userID: "U03",
          setIDs: ["set13", "set14", "set15"],
          description: "This is season set 5",
          title: "Season Set 5",
          totalYardage: 7400
        },
        {
          seasonID: "S06",
          userID: "U03",
          setIDs: ["set16", "set17", "set18"],
          description: "This is season set 6",
          title: "Season Set 6",
          totalYardage: 9800
        },
      ]
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
