<template>
  <div>
    <h2 class="text-2xl font-semibold">Day {{ practiceSet.Day }}</h2>
    <p>Total Practice Yardage: {{ practiceSet.TotalPracticeYardage }} yards</p>
    <div v-for="(practice, index) in practiceSet.Practices" :key="index">
      <h4 class="mt-2 font-medium">{{ practice.Type }}</h4>
      <ul>
        <li v-for="(exercise, index) in practice.Exercises" :key="index">
          {{ exercise.description }} ({{ exercise.yards }} yards)
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ['id'],
  computed: {
    practiceSet() {
      // Assuming you store your practice sets in a global state like Vuex
      return this.$store.state.practiceSets[this.id];
    }
  }
};
</script>
