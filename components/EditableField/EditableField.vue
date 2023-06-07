<template>
    <td class="border border-gray-700 px-2 md:px-4 py-1 md:py-2">
      <input v-if="isEditing" v-model="localValue" class="bg-gray-700 text-white rounded px-2 py-1">
      <span v-else>{{ localValue }}</span>
    </td>
  </template>
  
  <script>
  export default {
    props: ['value', 'isEditing'],
    data() {
      return {
        localValue: this.value,
      };
    },
    watch: {
      value(newValue) {
        this.localValue = newValue;
      },
    },
  };
  </script>
  