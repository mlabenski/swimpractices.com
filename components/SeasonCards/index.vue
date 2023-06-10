<template>
  <div class="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-2">
    <div class="max-w-sm mx-auto bg-gray-100 rounded overflow-hidden shadow-2xl border border-gray-300 relative hover:animate-shake">
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">{{ season.title }}</div>
        <p class="text-gray-700 text-base">
          {{ season.description }}
        </p>
      </div>
      <div class="px-6 pt-4 pb-2">
        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{{ season.totalYardage }} Yards</span>
        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{{ season.setIDs.length }} Days</span>
      </div>
      <div class="absolute bottom-0 right-0 mb-4 mr-4">
        <span class="material-icons text-opacity-50">favorite</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    season: {
      type: Object,
      required: true
    }
  }
}
</script>
