<template>
  <!-- Root Div -->
  <div id="app">
    <MobileNavBarTop class="sm:hidden block z-99" @openProfile="openProfile"/>
    <!-- Banner image section -->
    <div class="md:block hidden">
      <div id="top" class="min-h-screen">

        <div class="relative bg-customBlack h-auto min-h-72"> <!-- Ensure the height is auto to accommodate content -->

          <!-- Logo and top-right buttons container -->
          <div class="flex justify-between items-start p-4">
            <img src="@/static/swim-practices-good-bg-lg.png" class="w-52" />
            <div class="flex space-x-4">
              <button class="text-white bg-transparent border border-white rounded-full py-2 px-4 hover:bg-white hover:text-dark-purple">
                Find a Practice
              </button>
              <button class="text-white bg-transparent border border-white rounded-full py-2 px-4 hover:bg-white hover:text-dark-purple" @click="openSignup" >
                Log In
              </button>
            </div>
          </div>
          <!-- Two columns -->
          <div class="grid grid-cols-2 gap-4 p-4 md:p-8 lg:p-16">
            <div class="flex flex-col justify-center text-left ml-12 md:ml-24 lg:ml-36 text-white">
              <h1 class="text-5xl md:text-6xl font-bold mb-4 leading-tight">Reward-Driven Swim Practice Repository</h1>
              <p class="text-lg md:text-xl mb-6">1000+ achievable and thought out practices to use.</p>
              <button class="bg-backgroundBlue text-white font-bold py-3 px-6 rounded-full hover:bg-backgroundBlue transition duration-300 ease-in-out mb-6">
                Explore Practices
              </button>
              <p class="text-md md:text-lg mb-4 italic">Experience personalized skill advancement with each session.</p>
              <div class="mt-4">
                <span class="text-md md:text-lg">Practice like your coach is on the pool deck!</span>
              </div>
            </div>
            <!-- Visual representation column (if needed) -->
            <div class="">
              <img src="@/static/background-1368-912-wide.svg" class="object-contain w-full h-full" />
            </div>
          </div>
          <!-- Optional: Visual representation of piano keys and music notes (if needed) -->
          <!-- <div class="w-full">
            <img src="@/static/background-1368-912-wide.svg" class="object-contain w-full" />
          </div> -->

        </div>
    <!-- Infinite Set List Container -->
      <div class="container mx-auto py-10 flex items-center mt-8 justify-center"><!-- You may adjust the padding as needed -->
      <!-- Centering the component and following the same design as the video -->
      <div class="flex justify-center">
        <div class="w-full max-w-8xl"> <!-- This should match the max-width of the video element in the design -->
          <!-- Title and other elements here should match the style of the video title -->
          <infinite-set-list class="align-center" :practice-sets="practices"/>
        </div>
      </div>
    </div>
    </div>
    </div>
    <!-- Container for all the components below the header -->
    <div class="container mx-auto py-2">
      <div class="sm:px-4">
        <b-button pill variant="outline-primary" class="floating-button" @click.prevent="startPractice" title="Create practice" v-b-hover="hoverHandler">
          <span class="material-icons" style="color: white">add</span>
          {{ buttonText }}
        </b-button>
      </div>

      <!-- Modal components -->
      <div class="flex flex-col sm:flex-row justify-center">
        <GeneratePractice :user="user" v-model="generatePracticeModal" @practice-generated="handleNewPractice" @sign-up-clicked="handleSignUpClicked" ></GeneratePractice>
        <GenerateSetModel v-if="isModalOpen" @close="closeModal" />
        <NotificationModal :isNotificationModalOpen="isNotificationModalOpen" @close="closeNotificationModal" :notification="notification"/>
        <LogsNotificationModel></LogsNotificationModel>
      </div>

      <!-- Set lists -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 sm:mt-20">
      <!-- Dropdown for selecting set list -->
      <div v-if="user" class="flex items-center justify-between border sm:border-transparent sm:bg-transparent sm:text-white bg-gray-200 text-black dropdown-style">
        <select v-model="selectedSetList" @change="onSetListChange" class="text-2xl font-bold mb-1 cursor-pointer bg-gray-200 w-full">
          <option v-for="option in setListOptions" :value="option" :key="option">
            {{ option }}
          </option>
        </select>
      </div>
      <select v-else v-model="selectedSetList" @change="onSetListChange" class="setlist-dropdown hidden md:block lg:block bg-gray-200 text-black dropdown-style w-full">
        <option value="Browse Practices">Browse Practices</option>
        <option value="Featured Practice">Featured Practice</option>
        <!-- My Practices option is not rendered as user is not logged in -->
      </select>

        <!-- My Templates set list -->
        <div class="relative flex flex-col items-center">
          <ProfileWidget v-if="user && profileOpened" />
          <MobileSetList
            v-if="user && selectedSetList === 'My Practices'"
            class="sm:hidden"
            title="My Templates"
            @hide-practice="handleHidePractice"
            :practiceSets="userPractices"
            :userID="user ? user.id : null"
            :userPinnedPractices="userPinnedPractices">
          </MobileSetList>

          <!-- Desktop version for My Templates -->
          <SetList
            v-if="user && selectedSetList === 'My Practices'"
            title="My Templates"
            :userID="user ? user.id : null"
            :practiceSets="userPractices"
            class="hidden md:block">
          </SetList>
          <div v-if="!user" class="absolute inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center z-50 mt-14 max-h-14 sm:block hidden">
            <p class="text-white text-2xl sm:block hidden" @click="openSignup">Log in to save practices</p>
          </div>
          <!-- More SetList components here as needed -->
          <!-- ...rest of your component... -->
        </div>

        <!-- Free sets list -->
        <div v-if="filteredPractices">
          <MobileSetList v-if="selectedSetList === 'Browse Practices'"  class="sm:hidden" title="Free Sets" @hide-practice="handleHidePractice" :practiceSets="filteredPractices" :userID="user ? user.id : null" :userPinnedPractices="userPinnedPractices" ></MobileSetList>
          <SetList title="Browse Practices" class="hidden md:block" :practiceSets="practices" :userID="user ? user.id : null" ></SetList>
          <!-- More SetList components here as needed -->
        </div>
      </div>
    </div>


    <!-- Grouped Practices section -->
    <div class="grid grid-cols-1 mt-2 md:mt-4 pb-24 lg:pb-32 sm:pb-6 pt-12 sm:pt-0">
      <div class="flex flex-wrap w-full">
        <div class="flex items-center justify-between sm:block">
        </div>
        <!-- Grouped Practices cards -->
        <SeasonCards v-for="(season, index) in seasonPractices" :season="season" :id="season.id" :user="user" :rank="index + 1" :key="season.id" @like="handleLike(season.id)" class="pb-2 sm:pb-2 pt-6 sm:pt-6 md:pt-10 lg:pt-24"/>
      </div>
    </div>
    <!-- Header -->
    <div class="sm:hidden">
      <keep-alive>
        <TopNavBar class="top-nav-bar-class" :key="componentKey" :user="user ? user.id : null" @startPractice="startPractice" @openSignup="openSignup" @logout="logout"/>
      </keep-alive>
    </div>
  </div>
</template>

<script>
// Component imports
import GenerateSetModel from '@/components/GenerateSetModel';
import SetList from '@/components/SetList/SetList.vue';
import MobileSetList from '@/components/MobileSetList/MobileSetList.vue';
import MobileNavBarTop from '@/components/MobileNavBarTop';
import SeasonCards from "@/components/SeasonCards/index.vue";
import notificationsData from '@/data/notifications';
import NotificationModal from '@/components/NotificationModal';
import ProfileWidget from '@/components/ProfileWidget';
import GeneratePractice from "@/components/GeneratePractice/index.vue";
import TopNavBar from "@/components/TopNavBar/index.vue";
import LogsNotificationModel from '@/components/LogsNotificationModel/index.vue';
import InfiniteSetList from '@/components/InfiniteScrollSetList/SetList.vue'
//VueX inputs
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
    NotificationModal,
    GeneratePractice,
    TopNavBar,
    LogsNotificationModel,
    ProfileWidget,
    MobileNavBarTop,
    InfiniteSetList
  },
  async mounted() {
    try {
      await this.$store.dispatch('practices/fetchPractices');
      // Are we sure the fetchUserpractices should be called here because user isn't valid
      await this.$store.dispatch('practices/fetchUserPractices');
      await this.$store.dispatch('bindSeasonPractices');
      await this.$store.dispatch('practices/fetchPinnedPractices');
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
      practiceData: null,
      setListOptions: ['Browse Practices', 'Featured Practice', 'My Practices'],
      notification: notificationsData.notifications[0],
      generatePracticeModal: false,
      newPracticeId: null,
      profileOpened: false,
      componentKey: 0,
      buttonText: '',
      isHovered: false,
      selectedSetList: 'Browse Practices',
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      practices: 'practices/practices',
      seasonPractices: 'seasons',
      userPractices: 'practices/userPractices',
      filteredPractices: 'practices/filteredPractices',
      userPinnedPractices: 'practices/userPinnedPractices'
    }),
  },
  created() {
    this.checkNotifications();
    this.forceRerender();
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
      // To be implemented
    },
    hoverHandler(isHovered) {
      this.buttonText = isHovered ? 'Create Practice' : '';
    },
    handleSignUpClicked() {
      this.generatePracticeModal = false;
      // This method will be triggered when the 'sign-up-clicked' event is emitted by the child
      this.openSignup();
    },
    // This is the routing for a new practice. We could also move params: { idtwo: id } for mobile devices.
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
    goHome() {
      // Navigate to the selected practice page
      this.$router.push({ name: '/'});
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
      this.profileOpened = !this.profileOpened;
    },
    checkNotifications() {
      this.hasNotification = notificationsData.notifications.length > 0;
    },
    forceRerender() {
      this.componentKey += 1;
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
    handleHidePractice(practiceId) {
      // Commit a mutation to the Vuex store
      console.log('commit');
      this.$store.commit('practices/removePractice', practiceId);
    }
  }
}
</script>

<style scoped>
.container {
  padding-left: 1em;
  padding-right: 1em;
}


@media (min-width: 984px) {
  .container {
  padding-left: 0em;
  padding-right: 0em;
  }
}

#app {
  background-image: url(@/static/background-414-896-iphone-xr.svg) !important;
  background-color: #CFD7D7 !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-size: cover !important;
  font-family: 'Noto Sans', sans-serif;
  height: 100%;
}


@media (min-width: 600px) {
  #app {
    background-image: url(@/static/background-912-1368-pro.svg) !important;
  }
  .container {
    padding-left: 0em;
    padding-right: 0em;
  }
}

@media (min-width: 768px) {
  #app {
    background-image: url(@/static/background-1368-912-wide.svg) !important;
  }
  .container {
    padding-left: 0em;
    padding-right: 0em;
  }
}

@media (min-width: 1024px) {
  #app {
    background-image: url(@/static/desktop-1920-1260.svg) !important;
  }
  .container {
    padding-left: 0em;
    padding-right: 0em;
  }
}

.setlist-dropdown {
  display: none;
}

@media (max-width: 768px) {
  .setlist-dropdown {
    display: block;
  }
  .container {
    padding-left: 0em;
    padding-right: 0em;
  }
}
.modalContent {
  padding-top: 50px;
}
.floating-button {
  position: fixed;
  bottom: 75px;
  right: 8px;
  z-index: 9999;
  background-color: #0C6DFD;
  border-radius: 50%; /* Ensures it's circular */
  width: 60px; /* Set a fixed width for the circular shape */
  height: 60px; /* Same height as width to ensure a perfect circle */
  display: flex; /* Flexbox to center the icon */
  align-items: center; /* Vertically center */
  justify-content: center; /* Horizontally center */
}


.floating-button-two {
  position: fixed;
  bottom: 60px;
  right: 40px;
  z-index: 299;
  padding-bottom: 9px;
}
.top-nav-bar-class {
    position: fixed;
    bottom: 0;
    height: 65px;
    left: 0;
    right: 0;
    z-index: 299;  /* Ensuring it's on top of other elements */
}
.floating-button {
  transition: 0.3s ease;
}

.floating-button:hover {
  transform: scale(1.05);
  width: 200px; /* Adjust as needed */
}

.dropdown-height {
  height: 70px; /* Adjust the height as per your requirement */
}

.dropdown-style {
  height: 50px; /* Adjusted height */
  font-size: 16px; /* Adjust the font size as per your requirement */
}
</style>
