<template>
  <!-- Root Div -->
  <div id="app">

    <!-- Header -->
    <div class="sm:hidden">
      <TopNavBar :user="user" @startPractice="startPractice" @openSignup="openSignup" @logout="logout"/>
    </div>
    <!-- Banner image section -->
    <div class="md:block hidden">
      <div class="relative">
        <img src="@/static/swim-practices-header.png" class="object-cover w-full h-64" />
        <div class="absolute inset-0 bg-black opacity-50"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center text-white">
            <h2 class="text-4xl font-bold mb-2">Swim Practices on Demand</h2>
            <!-- Login button -->
            <p class="text-xl cursor-pointer hover:text-blue-500 hover:bg-gray-800 hover:rounded-full py-2 px-4" @click="openSignup" v-if="!user">Log in to create your own</p>
            <p class="text-xl cursor-pointer hover:text-blue-500 hover:bg-gray-800 hover:rounded-full py-2 px-4" @click="openSignup" v-if="user">Welcome back {{user.username}}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Container for all the components below the header -->
    <div class="container mx-auto px-4 py-2">
      <div>
        <b-button pill variant="primary" class="floating-button" @click.prevent="startPractice">
          <span class="material-icons">add</span>
          New Practice
        </b-button>
        <b-button pill variant="secondary" class="floating-button-two" @click.prevent="openProfile">
          <span class="material-icons">account_circle</span>
          Profile
        </b-button>
      </div>
      <!-- Modal components -->
      <div class="flex flex-col sm:flex-row justify-center">
        <GeneratePractice :user="user" v-model="generatePracticeModal" @practice-generated="handleNewPractice"></GeneratePractice>
        <GenerateSetModel v-if="isModalOpen" @close="closeModal" />
        <NotificationModal :isNotificationModalOpen="isNotificationModalOpen" @close="closeNotificationModal" :notification="notification"/>
        <LogsNotificationModel></LogsNotificationModel>
      </div>

      <!-- Set lists -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4  mt-20">
        <!-- Dropdown for selecting set list -->
        <select v-model="selectedSetList" @change="onSetListChange" class="setlist-dropdown hidden md:block lg:block" v-if="user">
          <option v-for="option in setListOptions" :value="option">
            {{ option }}
          </option>
        </select>

        <!-- My Templates set list -->
        <div class="relative flex flex-col items-center">
          <ProfileWidget v-if="user" />
          <SetList title="My Templates" :userID="user ? user.id : null" :practiceSets="userPractices" v-if="user"></SetList>
          <div v-if="!user" class="absolute inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center z-50 mt-14 max-h-14 sm:block hidden">
            <p class="text-white text-2xl sm:block hidden" @click="openSignup">Log in to save practices</p>
          </div>
          <!-- More SetList components here as needed -->
          <!-- ...rest of your component... -->
        </div>

        <!-- Free sets list -->
        <div v-if="practices">
          <MobileSetList class="sm:hidden" title="Free Sets" :practiceSets="practices" :userID="user ? user.id : null" ></MobileSetList>
          <!-- <SetList title="Free Sets" :practiceSets="practices" :userID="user ? user.id : null" ></SetList> -->
          <!-- More SetList components here as needed -->
        </div>
      </div>



      <!-- Manual practice entry -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4" v-if="user == '192019fps'">
        <h3 class="text-lg font-bold mb-2">Manual Practice Entry</h3>
        <textarea v-model="pastedPractice" rows="10" cols="50" placeholder="Paste the practice JSON here"></textarea>
        <button @click="submitPractice">Submit Practice</button>
      </div>
    </div>


    <!-- Grouped Practices section -->
    <div class="grid grid-cols-1 gap-4 mt-2 md:mt-4 pb-24 lg:pb-32 sm:pb-6 pt-12 sm:pt-0">
      <div class="flex flex-wrap w-full">
        <div class="flex items-center justify-between sm:block">
        </div>
        <!-- Grouped Practices cards -->
        <SeasonCards v-for="(season, index) in seasonPractices" :season="season" :id="season.id" :user="user" :rank="index + 1" :key="season.id" @like="handleLike(season.id)" class="pb-2 sm:pb-2 pt-6 sm:pt-6 md:pt-10 lg:pt-24"/>
      </div>
    </div>

  </div>
</template>

<script>
import GenerateSetModel from '@/components/GenerateSetModel';
import SetList from '@/components/SetList/SetList.vue';
import SeasonCards from "@/components/SeasonCards/index.vue";
import notificationsData from '@/data/notifications';
import NotificationModal from '@/components/NotificationModal';
import ProfileWidget from '@/components/ProfileWidget';
import { mapGetters, mapActions } from "vuex";
import practiceSetsNew from "../data/practiceSetsNew";
import GeneratePractice from "@/components/GeneratePractice/index.vue";
import TopNavBar from "@/components/TopNavBar/index.vue";
import LogsNotificationModel from '@/components/LogsNotificationModel/index.vue';
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
    NotificationModal,
    GeneratePractice,
    TopNavBar,
    LogsNotificationModel,
    ProfileWidget
  },
  async mounted() {
    try {
      // await this.$store.dispatch('bindPractices');
      await this.$store.dispatch('practices/fetchPractices');
      await this.$store.dispatch('practices/fetchUserPractices');
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
        'Featured Practice',
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
      ],
      generatePracticeModal: false,
      newPracticeId: null,
      profileView: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      practices: 'practices/practices',
      seasonPractices: 'seasons',
      userPractices: 'practices/userPractices'
    }),
  },
  created() {
    this.checkNotifications();
  },
  methods: {
    practiceSetsNew() {
      return practiceSetsNew
    },
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
    async handleNewPractice(newPracticeId) {
      // Do something with newPracticeId, e.g., assign it to a local data property
      if(newPracticeId){
        this.newPracticeId = newPracticeId;
        this.$forceUpdate();
        await this.$store.dispatch('practices/fetchUserPractices');
        this.$router.push({ name: 'id', params: { id: newPracticeId } });
      }
      else {
        await this.$store.dispatch('notifications/addNotification', {message: 'Something broke while creating the new practice '+ newPracticeId, type: 2})
      }
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
      this.generatePracticeModal = true;
    },
    openProfile() {
      this.profileView = true;
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
      const jwt = this.user.token;
      console.log(jwt);
      console.log(seasonId);
      const seasonRef = this.$fire.firestore.collection('seasons').doc(seasonId);

      seasonRef.update({
        likes: this.$fire.firestore.FieldValue.increment(1),
      }).catch((error) => {
        console.error('Error updating likes: ', error);
      });
    },
    onSetListChange(e) {
      this.selectedSetList = e.target.value;
      if (this.selectedSetList === 'Featured Practice') {
        this.$router.push({ name: 'id', params: { id: '3PMtTR93QWGvy2n1tlBC' } });
      }
    },
  }
}
</script>

<style>
.container {
  padding-left: 1em;
  padding-right: 1em;
}

#app {
  background-image: url(@/static/background-414-896-iphone-xr.svg) !important;
  background-color: #CFD7D7 !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-size: cover !important;
  font-family: 'Noto Sans', sans-serif;
}


@media (min-width: 600px) {
  #app {
    background-image: url(@/static/background-912-1368-pro.svg) !important;
  }
}

@media (min-width: 768px) {
  #app {
    background-image: url(@/static/background-1368-912-wide.svg) !important;
  }
}

@media (min-width: 1024px) {
  #app {
    background-image: url(@/static/desktop-1920-1260.svg) !important;
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

.floating-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  padding-bottom: 9px;
}

.floating-button-two {
  position: fixed;
  bottom: 20px;
  right: 40px;
  z-index: 9999;
  padding-bottom: 9px;
}

</style>
