<template>
  <div class="z-121">
    <div class="flex items-center justify-between border sm:border-transparent sm:bg-transparent sm:text-white bg-gray-200 text-black">
      <h2 class="text-2xl font-bold mb-1" v-if="!changeTheme">{{ title }}</h2>
      <span class="material-icons cursor-pointer" @click="toggleTable">
          {{ isTableVisible ? 'expand_less' : 'expand_more' }}
      </span>
    </div>



    <!-- Mobile view (Card Format) -->
    <div class="sm:hidden pb-10">
      <div
        v-for="practice in sortedPractices"
        :key="practice.practiceId"
        ref="swipeCards"
        :data-id="practice.id"
        @click="showPracticeOverlay(practice)"
        :class="[
          'bg-white shadow-md p-4 rounded border-b border-gray-300 transform transition-transform duration-150 block z-122',
          isPinned(practice) ? 'pinned' : ''
        ]"
      >
      <div v-if="isPinned(practice)" class="pinned-mark z-999">
            <div class="yellow-line"></div>
            <div class="yellow-line"></div>
            <div class="yellow-line"></div>
          </div>
        <div v-if="showOverlay && selectedPractice === practice" class="absolute top-0 left-0 w-full h-full bg-gray-800 opacity-80 flex items-center justify-center z-129">
          <div class="bg-white p-4 rounded shadow-md">
            <span class="material-icons cursor-pointer absolute top-2 right-2" @click.stop="closeOverlay">close</span>
            <p class="mb-4 mt-3">Open practice?</p>
            <button @click.stop="confirmNavigate" class="bg-blue-500 text-white px-4 py-2 rounded">Confirm</button>
          </div>
        </div>
        <!-- Title -->
        <div class="flex justify-between items-center mb-2" v-if="!hiddenPractices.includes(practice)">
          <div class="font-bold text-lg">{{ practice.name }}</div>
          <div class="text-lg text-gray-600">{{ practice.totalTime }}</div>
        </div>

        <!-- Pills -->
        <div class="flex">
          <span class="bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm">{{ getTotalYardage(practice.sets) }} Distance</span>
          <span class="bg-green-200 text-green-700 px-3 py-1 rounded-full text-sm">{{practice.primaryStroke}}</span>

          <!-- Conditional rendering for the measurement pill -->
          <span
            v-if="practice.measurement === 1"
            class="bg-red-200 text-red-700 px-3 py-1 rounded-full text-sm"
          >
            25 Yards
          </span>

          <span
            v-if="practice.measurement === 2"
            class="bg-red-200 text-red-700 px-3 py-1 rounded-full text-sm"
          >
            25 Meters
          </span>

          <span
            v-if="practice.measurement === 3"
            class="bg-red-200 text-red-700 px-3 py-1 rounded-full text-sm"
          >
            50 Meters
          </span>

          <span class="bg-yellow-200 text-yellow-700 px-3 py-1 rounded-full text-sm">Advanced</span>
        </div>


        <!-- Footer -->
        <div class="flex justify-between mt-2">
          <div class="flex space-x-2 z-205">
            <button @click.stop="likePractice(practice)" :class="{'text-yellow-500': isPinned(practice), 'text-blue-500': !isPinned(practice) && practice.liked, 'text-gray-500': !isPinned(practice) && !practice.liked}" class="z-130">
            <span class="material-icons">thumb_up</span>
          </button>
            <button @click.stop="dislikePractice(practice)" :class="{'text-red-500': practice.disliked, 'text-gray-500': !practice.disliked}" class="z-130">
              <span class="material-icons">thumb_down</span>
            </button>
          </div>

          <div class="flex items-center space-x-2 z-205" @click.stop="savePractice(practice.id)">
            <span class="material-icons text-gray-700 z-205">share</span>
            <span class="text-blue-600 z-130">Share</span>
          </div>
        </div>
      </div>
      </div>
      <div v-if="isTableVisible" class="flex justify-center mt-4 space-x-1 sm:space-x-4">
        <button @click="previousPage" :disabled="currentPage === 1" class="px-2 sm:px-4 py-1 sm:py-2 bg-transparent text-xs sm:text-base text-black rounded disabled:opacity-50">
          <span class="sm:hidden material-icons">chevron_left</span>
        </button>
        <div class="self-center text-sm sm:text-lg font-bold">Page {{ currentPage }} of {{ totalPages }}</div>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-2 sm:px-4 py-1 sm:py-2 bg-transparent text-xs sm:text-base text-black rounded disabled:opacity-50">
          <span class="sm:hidden material-icons">chevron_right</span>
        </button>
      </div>
    </div>
</template>



<script>
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}


export default {
  props: {
    title: {
      type: String,
      required: true
    },
    practiceSets: {
      type: Array,
      required: true
    },
    userID: {
      type: String,
      required: false
    },
    changeTheme: {
      type: Number,
      required: false
    },
    userPinnedPractices: {
      type: Array,
      required: false,
      default: () => [],
    }
  },
  data() {
    return {
      templates: [],
      isTableVisible: true,
      currentPage: 1,
      itemsPerPage: 10,
      startX: null,
      startY: null,
      initialX: null,
      currentX: null,
      hiddenPractices: [],
      debounceTimer: null,
      touchMoveEvent: null,
      debouncedHidePractice: null,
      debouncedOpenPractice: null,
      showOverlay: false,
      selectedPractice: null
    };
  },
  mounted() {
    this.highlightCards();
    this.$refs.swipeCards.forEach(card => {
      card.addEventListener("touchstart", this.handleTouchStart);
      card.addEventListener("touchmove", this.handleTouchMove);
    });
  },
  computed: {
    isLoading() {
      return this.$store.getters['practices/isLoading'];
    },

    practices() {
      return this.$store.getters['practices/practices'];
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return Object.entries(this.practiceSets)
        .slice(start, end)
        .map(([practiceId, practice]) => ({...practice, practiceId}));
    },
    totalPages() {
      return Math.ceil(Object.keys(this.practiceSets).length / this.itemsPerPage);
    },
    sortedPractices() {
      return [...this.paginatedData].sort((a, b) => {
        const aIsPinned = this.isPinned(a);
        const bIsPinned = this.isPinned(b);
        if (aIsPinned && !bIsPinned) {
          return -1;
        }
        if (!aIsPinned && bIsPinned) {
          return 1;
        }
        return 0;
      });
    },
  },
  created() {
    this.debouncedHidePractice = this.debounce(this.hidePractice, 200);
    this.debouncedOpenPractice = this.debounce(this.openPractice, 200);
    // Fetch templates based on the component type (my templates or recommended templates)
    if (this.title === 'My Templates') {
      this.fetchMyTemplates();
    } else if (this.title === 'Recommended Templates') {
      this.fetchRecommendedTemplates();
    }
  },
  methods: {
    debounce(func, delay) {
      let debounceTimer;
      return function(...args) {
        const context = this;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
      };
    },
    isPinned(practice) {
      if(this.userPinnedPractices) {
        console.log('there is a pinned practice, now we check if the array includes the ID');
        console.log(practice.id);
        console.log(this.userPinnedPractices);
        return this.userPinnedPractices.includes(practice.id);
      }
    },
    highlightCards() {
      console.log('hello');
      this.$refs.swipeCards.forEach(card => {
        console.log('hello');
        console.log(card);
        card.style.backgroundColor = 'lightyellow';  // Changes background color of each card
      });
    },
    async savePractice(id) {
      if(!this.userID) {
        alert('bot signed in')
      }
      else {
        const result = await this.$store.dispatch('practices/savePractice', id);

        if (result.success) {
            alert('Practice saved successfully!');
        } else {
            alert(`Failed to save practice. ${result.message}`);
        }
      }
    },
    fetchMyTemplates() {
      // Make an API call to fetch user-specific templates
      // Example API call using axios:
      // axios.get('/api/my-templates')
      //   .then(response => {
      //     this.templates = response.data;
      //     this.isLoading = false;
      //   })
      //   .catch(error => {
      //     console.error(error);
      //     this.isLoading = false;
      //   });

      // Mock data for demonstration purposes
      this.templates = [
        { id: 1, name: 'Template 1' },
        { id: 2, name: 'Template 2' },
        { id: 3, name: 'Template 3' }
      ];
    },
    async likePractice(practice) {
      if(!this.userID) {
        alert('Not signed in');
        return;
      }
      
      try {
        // Reference to the user's document in the Firestore "users" collection
        const userDocRef = this.$fire.firestore.collection('users').doc(this.userID);
        console.log(practice);
        // Use the `set` method with `{ merge: true }` to either create a new document
        // or merge the new data with an existing document
        await userDocRef.set({
      pinnedPractices: this.$fireModule.firestore.FieldValue.arrayUnion(practice.id)
    }, { merge: true });

        alert('Practice pinned successfully');
      } catch (error) {
        console.error('Failed to pin practice', error);
        alert('Failed to pin practice');
      }
    },
    async dislikePractice(practice) {
      if(!this.userID) {
        alert('Not signed in');
        return;
      }
      
      try {
        // Reference to the user's document in the Firestore "users" collection
        const userDocRef = this.$fire.firestore.collection('users').doc(this.userID);
        // Get the current user document
        const userDoc = await userDocRef.get();
        
        if (!userDoc.exists) {
          alert('User does not exist');
          return;
        }

        const userData = userDoc.data();

        // Reference to the practice's document in the Firestore "practices" collection
        const practiceDocRef = this.$fire.firestore.collection('practices').doc(practice.id);
        const practiceDoc = await practiceDocRef.get();
        
        if (!practiceDoc.exists) {
          alert('Practice does not exist');
          return;
        }

        // If the practice was previously liked
        if (userData.pinnedPractices && userData.pinnedPractices.includes(practice.id)) {
          // Remove it from the pinned practices
          await userDocRef.update({
            pinnedPractices: this.$fireModule.firestore.FieldValue.arrayRemove(practice.id),
            dislikedPractices: this.$fireModule.firestore.FieldValue.arrayUnion(practice.id) // Add to disliked practices
          });
          
          // Decrement the practice likes in the Firestore "practices" collection
          await practiceDocRef.update({
            likes: practiceDoc.data().likes ? practiceDoc.data().likes - 1 : 0
          });
        } else if (!userData.dislikedPractices || !userData.dislikedPractices.includes(practice.id)) {
          // If it wasn't previously disliked, add it to dislikedPractices and decrement likes
          await userDocRef.update({
            dislikedPractices: this.$fireModule.firestore.FieldValue.arrayUnion(practice.id)
          });

          // Decrement the practice likes in the Firestore "practices" collection
          const newLikesCount = practiceDoc.data().likes ? practiceDoc.data().likes - 1 : -1;
          await practiceDocRef.update({
            likes: newLikesCount
          });
        } else {
          // The practice was already disliked by the user
          alert('You have already disliked this practice');
          return;
        }

        alert('Practice disliked successfully');
      } catch (error) {
        console.error('Failed to dislike practice', error);
        alert('Failed to dislike practice');
      }
    },




    toggleTable() {
      this.isTableVisible = !this.isTableVisible;
    },
    handleTouchMove3(e) {
      this.currentX = e.touches[0].clientX;
      const diffX = this.currentX - this.initialX;

      // Check if it's a left swipe (negative difference)
      if (diffX < -50) { // You can adjust this threshold (50) accordingly
        //
        // this.hidePractice(e.currentTarget.dataset.id);
        //
        const practice = this.practiceSets.find(p => p.id === e.currentTarget.getAttribute("data-id"));
        console.log('activation hide practice call')
        console.log(practice);
        this.hidePractice(e.currentTarget.getAttribute("data-id"));

      } else if (diffX > 50) { // Right swipe (positive difference)

        //
        // this.openPractice(e.currentTarget.dataset.id);
        //
        const practiceId = e.currentTarget.getAttribute("data-id");
        this.openPractice(practiceId);
      }
    },
    handleTouchMove(e) {
      this.currentX = e.touches[0].clientX;
      const diffX = this.currentX - this.initialX;

      // Check if it's a left swipe (negative difference)
      if (diffX < -50) {
        const practiceId = e.currentTarget.getAttribute("data-id");
        this.debouncedHidePractice(practiceId);
      } else if (diffX > 50) { // Right swipe (positive difference)
        const practiceId = e.currentTarget.getAttribute("data-id");
        this.debouncedOpenPractice(practiceId);
      }
    },
    handleTouchMove2(event) {
      if (!this.startX || !this.startY) return;

      const xDiff = this.startX - event.touches[0].clientX;
      const yDiff = this.startY - event.touches[0].clientY;

      // Detect horizontal swipe (ignore vertical)
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          // Left swipe: Open practice
          const practiceId = event.currentTarget.getAttribute("data-id");
          this.openPractice(practiceId);
        } else {
          // Right swipe: Hide practice
          const practice = this.practiceSets.find(p => p.practiceId === event.currentTarget.getAttribute("data-id"));
          const debouncedHandler = debounce(() => this.hidePractice(practice), 500);
          debounceHandler();
        }
      }
    },
    handleTouchStart(e) {
      this.initialX = e.touches[0].clientX;
    },
    hidePractice(practice) {
      this.$emit('hide-practice', practice.id)
    },

    openPractice(practiceId) {
      this.$router.push({ name: 'idtwo', params: { idtwo: practiceId } });
    },
    fetchRecommendedTemplates() {
      // Fetch recommended templates from a JSON file stored on the frontend
      // Example using import statement:
      // import recommendedTemplates from '@/data/recommended-templates';
      // this.templates = recommendedTemplates;

      // Mock data for demonstration purposes
      this.templates = [
        { id: 1, name: 'Recommended Template 1' },
        { id: 2, name: 'Recommended Template 2' },
        { id: 3, name: 'Recommended Template 3' }
      ];
    },
    nextPage() {
      if(this.currentPage < this.totalPages) this.currentPage++;
    },
    previousPage() {
      if(this.currentPage > 1) this.currentPage--;
    },
    getTotalYardage(sets) {
      let totalYardage = 0;
      for (const setId in sets) {
        const set = sets[setId];
        for (const exerciseId in set.exercises) {
          const exercise = set.exercises[exerciseId];
          totalYardage += exercise.distance * exercise.quantity;
        }
      }
      return totalYardage;
    },
    async deletePractice(practiceId) {
      try {
        await this.$fire.firestore.collection('practices').doc(practiceId).delete();
        console.log('Practice deleted');
      } catch (error) {
        console.error('Error deleting practice: ', error);
      }
    },
    showPracticeOverlay(practice) {
      this.selectedPractice = practice;
      this.showOverlay = true;
    },
    confirmNavigate() {
      // Navigate to the selected practice page
      this.$router.push({ name: 'idtwo', params: { idtwo: this.selectedPractice.id } });
      this.showOverlay = false;
    },
    closeOverlay() {
      this.showOverlay = false;
      this.selectedPractice = null;
    }
  },
  beforeDestroy() {
    this.$refs.swipeCards.forEach(card => {
      card.removeEventListener("touchstart", this.handleTouchStart);
      card.removeEventListener("touchmove", this.handleTouchMove);
    });
  }


};
</script>

<style scoped>
.pinned {
  background-color: green;
}
.pinned-mark {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.yellow-line {
  width: 20px;
  height: 4px;
  background-color: yellow;
}
/* Add your custom styles here */
</style>
