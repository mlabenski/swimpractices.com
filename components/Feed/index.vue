<template>
    <div class="bg-gray-800 p-4 rounded-lg shadow-md mt-4">
      <h2 class="text-xl text-white mb-2">Recent Activity</h2>
      <ul>
        <li v-for="event in events" :key="event" class="text-gray-300 mb-1">
          {{ event }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: ['events']
  };
  </script>