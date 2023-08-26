<template>
  <nav class="relative bg-gray-900 text-white px-2 py-1 z-200 sticky top-0">
    <!-- Container for navbar items -->
    <div class="container mx-auto flex justify-between items-center">

      <!-- Left Section: Menu Icon and Dropdown section -->
      <div class="flex items-center space-x-2">
        <!-- Hamburger Icon -->
        <span class="material-icons cursor-pointer">menu</span>

        <!-- Dropdown section -->
        <div @click="toggleDropdown" class="cursor-pointer bg-gray-600 px-2 py-1 rounded flex items-center">
          {{ currentSelection }}
          <span class="material-icons ml-1">expand_more</span>
        </div>
      </div>

      <!-- Right Section: Magnifying Glass and Profile Picture -->
      <div class="flex items-center space-x-2">
        <span @click="toggleFilter" class="material-icons cursor-pointer">filter_list</span>
        <span class="material-icons cursor-pointer">search</span>
        <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center" @click="$emit('openProfile')">
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
        <div class="mb-4">
          <label for="minYardage" class="block text-sm font-medium text-white">Min Yardage</label>
          <input type="number" id="minYardage" v-model="minYardage" @input.stop class="mt-1 block w-full rounded-md bg-gray-900 border-transparent focus:border-green-500 focus:ring-0 text-white">
        </div>
        <div class="mb-4">
          <label for="maxYardage" class="block text-sm font-medium text-white">Max Yardage</label>
          <input type="number" id="maxYardage" v-model="maxYardage" @input.stop class="mt-1 block w-full rounded-md bg-gray-900 border-transparent focus:border-green-500 focus:ring-0 text-white">
        </div>
        <button @click="applyYardageFilter" class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded">
          Apply
        </button>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  data() {
    return {
      isDropdownOpen: false,
      currentSelection: 'Practices',
      isFilterOpen: false,
      minYardage: 0,
      maxYardage: 10000
    };
  },
  methods: {
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
      console.log('apply yardage filter')
      // Here, you'll dispatch the action to update your Vuex store with the filtered data
      this.$store.dispatch('practices/applyFilter', { minYardage: this.minYardage, maxYardage: this.maxYardage });
      this.toggleFilter();
    }
  }
};
</script>

<style scoped>
.sticky {
  position: sticky;
  top: 0;
  z-index: 1000; /* Adjust if needed to ensure it's above other elements */
}
</style>
