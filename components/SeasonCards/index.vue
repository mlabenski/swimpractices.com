<template>
  <div class="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-2 justify-center items-center mb-2 sm-mb-2">
    <div class="max-w-sm mx-auto bg-gray-100 rounded overflow-hidden shadow-2xl border border-gray-300 relative hover:animate-shake" style="background-color: lightsteelblue">
      <div class="flex justify-center items-center text-white text-2xl font-bold py-2">
        <span class="mr-2">#{{ rank }}</span>
        <span class="material-icons text-customYellow" style="color: yellow">emoji_events</span>
      </div>
      <div class="px-6 py-4" @click="showPracticeTable = !showPracticeTable">
        <div class="font-bold text-xl mb-2">{{ season.title }}</div>
        <p class="text-gray-700 text-base">
          {{ season.description }}
        </p>
      </div>
      <div class="px-6 pt-4 pb-2">
        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{{ season.totalYardage }} Yards</span>
        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{{ season.practices.length }} Days</span>
      </div>
      <div class="absolute bottom-0 right-0 mb-4 mr-4 cursor-pointer" @click="likeSeason(season.id)">
        {{ season.likes}}
        <span class="material-icons text-opacity-50">favorite</span>
      </div>
      <div v-if="showPracticeTable" class="px-6 pt-4 pb-2 bg-red-50">
        <SetList title="Season Table" :userID="user ? user: null" :practiceSets="season.practices"></SetList>
      </div>
    </div>
  </div>
</template>

<script>
import SetList from '@/components/SetList/SetList.vue';

export default {
  components: {
    SetList
  },
  props: {
    season: {
      type: Object,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    user: {
      type: String,
      required: false
    },
    rank: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      showPracticeTable: false,
    }
  },
  methods: {
    likeSeason(seasonId) {
      if (this.user) {
        console.log('season like event emitted');
        this.$emit('like', seasonId);
      }
      else {
        console.log('you must be logged in to like a season');
      }
    }
  },
}
</script>

<style scoped>
.absolute {
  z-index: 1;
}
.bg-red-50 {
  z-index: 2;
}
</style>


