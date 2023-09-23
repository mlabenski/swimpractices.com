<template>
  <nav class="relative bg-gray-900 text-white px-2 py-1 z-99 sticky top-0">
    <!-- Container for navbar items -->
    <div class="container mx-auto flex justify-between items-center">

      <!-- Left Section: Menu Icon and Dropdown section -->
      <div class="flex items-center space-x-2">

        <!-- Dropdown section -->
        <div @click="toggleDropdown" class="cursor-pointer bg-gray-600 px-2 py-1 rounded flex items-center sm:max-w-xs">
          <div class="truncate">{{ currentSelection }}</div>
          <span class="material-icons ml-1">expand_more</span>
        </div>
      </div>

      <!-- Right Section: Magnifying Glass and Profile Picture -->
      <div class="flex items-center space-x-2 ml-auto">
        <span v-if="!isSearchActive" @click="toggleFilter" class="material-icons cursor-pointer">filter_list</span>
        <input 
          v-if="isSearchActive" 
          v-model="searchTerm" 
          @keyup.enter="search" 
          ref="searchInput"
          class="rounded bg-gray-900 text-white px-2 py-1 transition-all duration-300 sm:w-36" 
          placeholder="Search...">

          <span 
          @click="toggleSearch" 
          class="material-icons cursor-pointer">
          search
        </span>
        <div v-if="!isSearchActive" class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center ml-auto" @click="$emit('openProfile')">
          <span class="material-icons text-white cursor-pointer">person</span>
      </div>
      </div>
    </div>

    <!-- Dropdown Options -->
    <div v-if="isDropdownOpen" class="absolute top-full left-0 w-full mt-2 bg-gray-800 rounded shadow-md z-10">
      <div class="container mx-auto">
        <div @click="selectOption('Practices')" class="cursor-pointer px-4 py-2 hover:bg-gray-700">Practices</div>
        <div @click="selectOption('Seasons')" class="cursor-pointer px-4 py-2 hover:bg-gray-700">Seasons</div>
        <div @click="selectOption('Featured')" class="cursor-pointer px-4 py-2 hover:bg-gray-700">Featured</div>
        <div @click="selectOption('My Profile')" class="cursor-pointer px-4 py-2 hover:bg-gray-700">My Profile</div>
      </div>
    </div>
    <!-- Filter Options Dropdown -->
    <div v-if="isFilterOpen" class="absolute top-full right-0 w-64 mt-2 bg-gray-800 rounded shadow-md z-10 p-4">
      <div>
        <!-- Yardage Filters -->
        <div class="mb-4">
          <label for="minYardage" class="block text-sm font-medium text-white">Min Yardage</label>
          <input type="number" id="minYardage" v-model="minYardage" @input.stop class="mt-1 block w-full rounded-md bg-gray-900 border-transparent focus:border-green-500 focus:ring-0 text-white">
        </div>
        <div class="mb-4">
          <label for="maxYardage" class="block text-sm font-medium text-white">Max Yardage</label>
          <input type="number" id="maxYardage" v-model="maxYardage" @input.stop class="mt-1 block w-full rounded-md bg-gray-900 border-transparent focus:border-green-500 focus:ring-0 text-white">
        </div>

        <!-- Stroke Filters -->
        <div class="bg-gray-900 p-2 rounded mb-4" v-if="uniqueStrokes">
          <div class="font-medium text-white mb-2">Strokes:</div>
          <div v-for="stroke in uniqueStrokes" :key="stroke" class="flex items-center mb-2">
            <input type="checkbox" :id="stroke" v-model="selectedStrokes" :value="stroke" class="cursor-pointer">
            <label :for="stroke" class="ml-2 text-white cursor-pointer">{{ stroke }}</label>
          </div>
        </div>
        <!-- Stroke Filters -->
        <div class="bg-gray-900 p-2 rounded mb-4" v-if="userPinnedPractices">
          <div class="font-medium text-white mb-2">Starred:</div>
          <input type="checkbox" v-model="showPinnedPractices" class="cursor-pointer">
        </div>
        <!-- Apply Button -->
        <button @click="applyYardageFilter" class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
          Apply
        </button>
      </div>
    </div>
  </nav>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      isDropdownOpen: false,
      currentSelection: 'Practices',
      isFilterOpen: false,
      minYardage: 0,
      maxYardage: 10000,
      selectedStrokes: [],
      searchTerm: '',
      isSearchActive: false,
    };
  },
  computed: {
    ...mapGetters('practices', ['uniqueStrokes', 'userPinnedPractices'])
  },
  methods: {
    toggleSearch() {
      this.isSearchActive = !this.isSearchActive;
      if (this.isSearchActive) {
        this.$nextTick(() => {
          this.$refs.searchInput.focus();
        });
        // Close the dropdown when search is toggled on
        this.isDropdownOpen = false;
      }
    },
    clearSearch() {
      this.searchTerm = '';
      this.isSearchActive = false;
    },
    search() {
      this.$store.dispatch('practices/searchPractices', this.searchTerm);
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectOption(option) {
      this.currentSelection = option;
      this.toggleDropdown();
    },
    toggleFilter() {
      this.isFilterOpen = !this.isFilterOpen;
    },
    applyYardageFilter() {
      console.log('apply yardage filter');
      console.log(this.showPinnedPractices);
      this.$store.dispatch('practices/applyFilter', {
        minYardage: this.minYardage, 
        maxYardage: this.maxYardage, 
        strokes: this.selectedStrokes,
        showPinnedOnly: this.showPinnedPractices
      });
      this.toggleFilter();
    }
  }
};
</script>

<style>
.sticky {
  position: sticky;
  top: 0;
  z-index: 99; /* Adjust if needed to ensure it's above other elements */
}
.container {
    overflow: hidden;
}

input[type="text"] {
    transition: max-width 0.3s ease-in-out;
}

</style>
