<template>
  <div>
    <header class="bg-gray-800 text-white text-lg px-4 py-2 fixed w-full z-50 flex items-center justify-between">
      <h1 class="font-semibold">Swimpractices.com</h1>
      <div class="relative ml-auto">
      <h1 class="font-semibold sm:hidden">View the Daily Practice</h1>
        <button @click="toggleNotifications" class="focus:outline-none md:hidden">
    <span class="material-icons text-white text-2xl md:hidden">
      lightbulb_outline
    </span>
          <!-- Notification Indicator -->
          <span v-if="notification" class="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
     <div class="md:block hidden">
      <div class="relative">
        <img src="@/static/swim-practices-header.png" class="object-cover w-full h-64" />
        <div class="absolute inset-0 bg-black opacity-50"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center text-white">
            <h2 class="text-4xl font-bold mb-2">Swim Practices on Demand</h2>
            <p class="text-xl cursor-pointer hover:text-blue-500" @click="openSignup">Log in to create your own</p>
          </div>
        </div>
      </div>
    </div>
    <div class="container mx-auto px-4 py-2">
      <div class="flex flex-col sm:flex-row justify-center">
        <GenerateSetModel v-if="isModalOpen" @close="closeModal" />
        <NotificationModal :isNotificationModalOpen="isNotificationModalOpen" @close="closeNotificationModal" :notification="notification"/>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4  mt-20">
        <select v-model="selectedSetList" @change="onSetListChange" class="setlist-dropdown hidden md:block lg:block">
          <option v-for="option in setListOptions" :value="option">
            {{ option }}
          </option>
        </select>
        <div class="relative">
          <SetList title="My Templates" :userID="user ? user.id : null" :practiceSets="userPractices"></SetList>
          <SetList v-if="selectedSetList === 'My Practices'" title="My Practices" :practiceSets="userPractices" :userID="user ? user.id : null" class="hidden md:block lg:block"></SetList>
          <!-- Add similar conditions for the other two SetList options -->

          <div v-if="practiceData">
            <h2 class="text-2xl font-bold mb-4">Generated Practice</h2>
            <pre>{{ practiceData }}</pre>
          </div>
          <div v-if="!user" class="absolute inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center z-50 max-h-24">
            <p class="text-white text-2xl" @click="openSignup">Log in to save practices</p>
          </div>
        </div>
        <div>
          <SetList title="Free Sets" :practiceSets="practices" :userID="user ? user.id : null" ></SetList>
          <SetList v-if="selectedSetList === 'Recommended Practices'" title="Recommended Practices" :practiceSets="practices" :userID="user ? user.id : null"  class="hidden md:block lg:block" ></SetList>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4 mt-4">
          <div class="flex flex-wrap">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold mb-4">Grouped Practices</h2>
              <span class="material-icons cursor-pointer">
          </span>
            </div>
            <SeasonCards v-for="season in seasonPractices" :season="season" :id="season.id" :user="user" :key="season.id" @like="handleLike"/>
          </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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
        <a href="#" class="flex flex-col items-center" @click.prevent="openSignup" v-if="!user">
          <span class="material-icons w-6 h-6 fill-current mb-2">lock_open</span>
          <span>Log In</span>
        </a>
        <a href="#" class="flex flex-col items-center" @click.prevent="logout" v-if="user">
          <span class="material-icons w-6 h-6 fill-current mb-2">lock_open</span>
          <span>Log Out</span>
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
import notificationsData from '@/data/notifications';
import NotificationModal from '@/components/NotificationModal';
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
    SeasonCards,
    NotificationModal
  },
  async mounted() {
    try {
      await this.$store.dispatch('bindPractices');
      if (this.$store.state.auth.user) {
        await this.$store.dispatch('bindUserPractices');
      }
      await this.$store.dispatch('bindSeasonPractices');
    } catch (e) {
      console.error(e)
    }
  },
  data() {
    return {
      isModalOpen: false,
      pastedPractice: '',
      hasNotification: false,
      isNotificationModalOpen: false,
      selectedSetList: 'My Practices',
      practiceData: null,
      setListOptions: [ // Available SetList's titles
        'Recommended Practices',
        'Practice of the Day',
        'My Practices'
      ],
      notification: notificationsData.notifications[0],
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
      userPractices: 'userPractices',
      seasonPractices: 'seasons'
    }),
  },
  created() {
   this.checkNotifications();
  },
  methods: {
    ...mapActions({
      openLogin: 'auth/openLogin',
      openSignup: 'auth/openSignup',
      logout: 'auth/logout'
    }),
    toggleNotifications() {
      this.isNotificationModalOpen = !this.isNotificationModalOpen;
    },
    startEmptyPractice() {
    // Logic to start an empty practice
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
    this.isModalOpen = false;
    },
    closeNotificationModal() {
      this.isNotificationModalOpen = false;
    },
    startPractice(practiceData) {
      console.log('emitted back to the main index');
      console.log(practiceData);
      this.practiceData = practiceData;
    },
    checkNotifications() {
      this.hasNotification = notificationsData.notifications.length > 0;
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
    },
    handleLike(seasonId) {
      if (!this.user) return;
      const seasonRef = this.$fire.firestore.collection('seasons').doc(seasonId);
      seasonRef.update({
        likes: this.$fire.firestore.FieldValue.increment(1),
      }).catch((error) => {
        console.error('Error updating likes: ', error);
      });
    },
    onSetListChange(e) {
      this.selectedSetList = e.target.value;
    },
  }
}
</script>

<style>
.container {
  padding-left: 1em;
  padding-right: 1em;
}

html {
  background-image: url(@/static/background-414-896-iphone-xr.svg);
  background-color: #CFD7D7;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  font: handwritten;
}

@media (min-width: 600px) {
  #app {
    background-image: url(@/static/background-912-1368-pro.svg);
  }
}

@media (min-width: 768px) {
  #app {
    background-image: url(@/static/background-1368-912-wide.svg);
  }
}

@media (min-width: 1024px) {
  #app {
    background-image: url(@/static/desktop-1920-1260.svg);
  }
}

.setlist-dropdown {
  display: none;
}

@media (max-width: 768px) {
  .setlist-dropdown {
    display: block;
  }
}

</style>
