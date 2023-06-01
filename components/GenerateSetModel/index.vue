<template>
  <div class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75">
    <div class="bg-white rounded-lg p-4 w-96">
      <h2 class="text-2xl font-bold mb-4">Generate Set Child</h2>

      <div class="mb-4">
        <label class="text-lg">Distance:</label>
        <div class="flex items-center">
          <span class="mr-2">{{ distance }}</span>
          <button @click="decrement('distance')">-</button>
          <button @click="increment('distance')">+</button>
        </div>
        <div class="flex">
          <template v-for="star in distanceStars">
        <span :key="star">
          <svg class="w-6 h-6 cursor-pointer" @click="setDistance(star)" :class="getStarClass('distance', star)" viewBox="0 0 24 24">
            <path d="M12 1L15.09 8.69L23 9.82L17 15.12L18.18 23L12 19.77L5.82 23L7 15.12L1 9.82L8.91 8.69L12 1Z" />
          </svg>
        </span>
          </template>
        </div>
      </div>

      <div class="mb-4">
        <label class="text-lg">Speed:</label>
        <div class="flex items-center">
          <span class="mr-2">{{ speed }}</span>
          <button @click="decrement('speed')">-</button>
          <button @click="increment('speed')">+</button>
        </div>
        <div class="flex">
          <template v-for="star in speedStars">
        <span :key="star">
          <svg class="w-6 h-6 cursor-pointer" @click="setSpeed(star)" :class="getStarClass('speed', star)" viewBox="0 0 24 24">
            <path d="M12 1L15.09 8.69L23 9.82L17 15.12L18.18 23L12 19.77L5.82 23L7 15.12L1 9.82L8.91 8.69L12 1Z" />
          </svg>
        </span>
        </template>
        </div>
      </div>

      <div class="mb-4">
        <label class="text-lg">Difficulty:</label>
        <div class="flex items-center">
          <span class="mr-2">{{ difficulty }}</span>
          <button @click="decrement('difficulty')">-</button>
          <button @click="increment('difficulty')">+</button>
        </div>
        <div class="flex">
          <template v-for="star in difficultyStars">
            <span :key="star">
          <svg class="w-6 h-6 cursor-pointer" @click="setDifficulty(star)" :class="getStarClass('difficulty', star)" viewBox="0 0 24 24">
            <path d="M12 1L15.09 8.69L23 9.82L17 15.12L18.18 23L12 19.77L5.82 23L7 15.12L1 9.82L8.91 8.69L12 1Z" />
          </svg>
        </span>
          </template>
        </div>
      </div>

      <button class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mb-4" :disabled="!isFormValid" @click="startPractice">Start Now</button>

      <button class="absolute top-0 right-0 px-2 py-1 m-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400" @click="closeModal">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      distance: 5,
      speed: 5,
      difficulty: 5,
      distanceStars: [1, 2, 3,4, 5],
      speedStars: [1, 2, 3, 4, 5],
      difficultyStars: [1, 2, 3, 4, 5]
    };
  },
  computed: {
    isFormValid() {
      return this.distance > 0 && this.speed > 0 && this.difficulty > 0;
    }
  },
  methods: {
    setDistance(star) {
      this.distance = star;
    },
    setSpeed(star) {
      this.speed = star;
    },
    setDifficulty(star) {
      this.difficulty = star;
    },
    decrement(category) {
      if (this[category] > 0) {
        this[category]--;
        this[`${category}Stars`] = this[`${category}Stars`].slice(0, this[category]);
      }
    },
    increment(category) {
      if (this[category] < 5) {
        this[category]++;
        this[`${category}Stars`] = Array.from(Array(this[category]), (_, i) => i + 1);
      }
      console.log('no increment')
    },
    startPractice() {
      // Maybe emit a more unique method to generate practice.. I
      //It'll display near the Templates area
      this.$emit('close');
      // Logic to start the personalized practice
    },
    closeModal() {
      this.$emit('close');
    },
    getStarClass(category, star) {
      const value = this[category];
      return {
        'text-yellow-500': star <= value
      };
    }
  }
}
</script>

<style scoped>
/* Add your custom styles here */
</style>
