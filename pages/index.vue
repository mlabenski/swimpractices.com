<template>
  <!-- Root Div -->
  <div id="app">
    <MobileNavBarTop v-if="user" class="sm:hidden block z-200 fixed pt-10" @openProfile="openProfile"/>
    <PendingPracticeNotification/>
    <LogsNotificationModel> </LogsNotificationModel>
    <!-- Banner image section -->
    <div class="md:block hidden">
      <div id="top" class="min-h-screen">

        <div class="relative customOrange h-auto min-h-72"> <!-- Ensure the height is auto to accommodate content -->

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
              <button class="bg-backgroundBlue text-white font-bold py-3 px-4 rounded-full hover:bg-backgroundBlue transition duration-300 ease-in-out mb-6 w-1/5">
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
         <div v-if="isDesktop">
           <infinite-set-list class="align-center" :practice-sets="practices"/>
         </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    <!-- Mobile Landing Page -->
    <div class="mobile-landing-page sm:hidden">
      <div class="landing-page-container w-screen flex flex-col justify-between bg-gray-900 text-white overflow-hidden">
        <div class="flex flex-col justify-between h-full p-4 z-200">
          <div class="flex-shrink-0 pt-safe">
            <img src="@/static/swim-practices-logo-blue.png" alt="Swim Practices" class="w-2/3 max-w-xs mb-4 rounded-lg shadow-lg" />
            <h1 class="text-3xl font-bold mb-2 leading-tight">Reward-Driven Swim Practice Repository</h1>
            <p class="text-lg mb-4">1000+ achievable and thought out practices to use.</p>
          </div>

          <div class="flex-grow flex flex-col justify-center">
            <div class="mb-6 bg-gray-800 p-4 rounded-lg shadow-inner">
              <p class="text-center text-sm uppercase tracking-wide mb-3">Available on</p>
              <div class="flex justify-center space-x-6">
                <div class="flex flex-col items-center" v-for="platform in platforms" :key="platform.name">
                  <i :class="platform.icon" class="text-2xl mb-1"></i>
                  <span class="text-xs">{{ platform.name }}</span>
                </div>
              </div>
            </div>

            <button
              @click="scrollToContent"
              class="bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out w-full mb-4 shadow-lg"
            >
              See All Practices
            </button>

            <div class="flex space-x-5 mb-4">
              <button
                @click="openDailyPractice"
                class="bg-white text-black font-bold py-1 px-4 rounded-full hover:bg-green-600 transition duration-300 ease-in-out flex-grow shadow-lg"
              >
                Daily Practice
              </button>
              <button
                class="bg-yellow-500 text-white font-bold py-2 px-2 rounded-full hover:bg-yellow-600 transition duration-300 ease-in-out flex-shrink-0 w-12 h-12 flex items-center justify-center shadow-lg"
              >
                ?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container mx-auto">
      <div class="sm:px-4" v-if="user">
        <b-button pill variant="outline-primary" class="floating-button" @click.prevent="startPractice" title="Create practice" v-b-hover="hoverHandler">
          <span class="material-icons" style="color: white">add</span>
          {{ buttonText }}
        </b-button>
      </div>

      <!-- Modal components -->
      <div class="flex flex-col sm:flex-row justify-center">
        <GeneratePractice
          v-if="generatePracticeModal"
          :user="user"
          v-model="generatePracticeModal"
          @practice-generated="handleNewPractice"
          @sign-up-clicked="handleSignUpClicked" >
        </GeneratePractice>
        <NotificationModal :isNotificationModalOpen="isNotificationModalOpen" @close="closeNotificationModal" :notification="notification"/>
      </div>

      <!-- Set lists -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2" id="content">
      <!-- Dropdown for selecting set list -->

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
          <!-- More SetList components here as needed -->
          <!-- ...rest of your component... -->
        </div>

        <!-- Free sets list -->
        <div v-if="filteredPractices">
          <MobileSetList v-if="selectedSetList === 'Browse Practices'"  class="sm:hidden" title="Free Sets" @hide-practice="handleHidePractice" @share-practice="shareUrl" :practiceSets="filteredPractices" :userID="user ? user.id : null" :userPinnedPractices="userPinnedPractices" ></MobileSetList>
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
    <div class="sm:hidden" v-if="user">
      <keep-alive>
        <TopNavBar
          class="bottom-nav-bar-class z-200"
          :key="componentKey"
          :user="user ? user.id : null"
          @startPractice="startPractice"
          @openSignup="openSignup"
          @logout="logout"
        />
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
import TopNavBar from "@/components/TopNavBar/index.vue";
import LogsNotificationModel from '@/components/LogsNotificationModel/index.vue';
import InfiniteSetList from '@/components/InfiniteScrollSetList/SetList.vue'
import AppInstallSuggestion from "@/components/AppInstall/AppInstallSuggestion.vue";
//VueX inputs
import { mapGetters, mapActions } from "vuex";
import PendingPracticeNotification from '@/components/PendingPracticeNotification/PendingPracticeNotification.vue';
import {theme} from "@/tailwind.config";
export default {
  head() {
    return {
      title: 'Swim Practice Generator',
      meta: [
        { hid: 'description',
          name: 'description',
          content: `Check out swim practices created by AI for free. Sign-up to track your season goals and to generate aligned practices to reach them`,
        },
        {
          name: 'apple-mobile-web-app-capable',
          content: 'yes'
        },
        // Mobile-Optimized Content
        {
          name: 'mobile-optimized',
          content: 'width'
        }
      ],
      link: [
        // Add this
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
      ],
    }
  },
  components: {
    GenerateSetModel,
    SetList,
    SeasonCards,
    NotificationModal,
    GeneratePractice: () => import('@/components/GeneratePractice/index.vue'),
    TopNavBar,
    LogsNotificationModel,
    ProfileWidget,
    MobileNavBarTop,
    InfiniteSetList,
    PendingPracticeNotification,
    AppInstallSuggestion
  },
  async mounted() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    this.checkPendingPractice();
    try {
      await this.$store.dispatch('practices/fetchPractices');
      await this.$store.dispatch('practices/fetchDailyPractice')
      await this.$store.dispatch('bindSeasonPractices');
      if (this.$store.state.auth.user) {
        await this.$store.dispatch('practices/fetchUserPractices');
      }
      await this.$store.dispatch('practices/fetchPinnedPractices');
    } catch (e) {
      console.error(e)
    }
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    this.$store.dispatch('practices/unbindPractices');
    this.$store.dispatch('practices/unbindUserPractices');
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
      platforms: [
        { name: 'iOS', icon: 'fas fa-apple' },
        { name: 'Android', icon: 'fab fa-android' },
        { name: 'Web', icon: 'fas fa-globe' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      practices: 'practices/practices',
      dailyPractice: 'practices/dailyPractice',
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
    checkPendingPractice() {
      const practiceId = localStorage.getItem('pendingPractice');
      if (practiceId) {
        this.pendingPracticeExists = true;
        this.practiceId = practiceId;
        console.log('Pending practice id:', this.practiceId);
      } else {
        this.pendingPracticeExists = false;
        this.practiceId = null;
      }
    },
    toggleNotifications() {
      this.isNotificationModalOpen = !this.isNotificationModalOpen;
    },
    handleResize() {
      this.isDesktop = window.matchMedia("(min-width: 768px)").matches;
    },
    openDailyPractice() {
      console.log(this.dailyPractice)
      const daily_id = this.dailyPractice.id
      this.$router.push({ name: 'idtwo', params: { idtwo: daily_id } });
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
    async shareUrl(practiceId) {
      const urlToCopy = `https://swimpractices.com/${practiceId}`;
      navigator.clipboard.writeText(urlToCopy).then(async () => {
        await this.$store.dispatch('notifications/addNotification', {
          message: 'Practice copied to clipboard!',
          type: 3
        });
      }).catch(err => {
        console.error('Failed to copy: ', err);
      })
    },
    // This is the routing for a new practice. We could also move params: { idtwo: id } for mobile devices.
    async handleNewPractice(newPracticeId) {
      // Do something with newPracticeId, e.g., assign it to a local data property
      if(newPracticeId){
        this.newPracticeId = newPracticeId;
        this.$forceUpdate();
        console.log('new practice ID equals '+ newPracticeId)
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
    },
    scrollToContent() {
      const contentElement = document.getElementById('content');
      if (contentElement) {
        contentElement.scrollIntoView({ behavior: 'smooth' });
      }
    },

    showHelp() {
      // Implement the logic for showing help
      console.log('Showing help');
    }
  }
}
</script>

<style scoped>

:root {
  --navbar-top-height: 20px; /* Adjust based on your top navbar height */
  --navbar-bottom-height: 4px; /* Adjust based on your bottom navbar height */
}

.mobile-landing-page {
  /* Override any conflicting styles from main.css */
  background-image: none !important;
  z-index: 200;
  font-size: 16px; /* Set a base font size for this component */
}

.mobile-landing-page .landing-page-container {
  position: relative;
  overflow: hidden;
  height: 100%;
  max-height: calc(100vh - var(20px) - var(20px)) !important;
}

.mobile-landing-page h1 {
  font-size: 1.875rem !important; /* Equivalent to text-3xl */
}

.mobile-landing-page p {
  font-size: 1rem !important; /* Equivalent to text-base */
}

.pt-safe {
  padding-top: max(env(safe-area-inset-top), 0.5rem);
}

@supports (-webkit-touch-callout: none) {
  .landing-page-container {
    height: calc(100vh - var(--navbar-top-height) - var(--navbar-bottom-height));
    height: calc(-webkit-fill-available - var(--navbar-top-height) - var(--navbar-bottom-height));
  }
}
.container {
  padding-left: 1em;
  padding-right: 1em;
}

html, body, #app {
  height: 100%;
  overflow-x: hidden;
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
    z-index: 100;  /* Ensuring it's on top of other elements */
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
.bg-customBlack {
  background-color: #1a1a1a;
}

.bg-backgroundBlue {
  background-color: #0C6DFD;
}
</style>
