<template>
    <td v-if="templateNum != 1" class="border border-gray-700 px-2 md:px-4 py-1 md:py-2">
      <input v-if="isEditing" v-model="localValue" class="bg-gray-700 text-white rounded px-2 py-1" @blur="handleBlur">
      <span v-else @click="handleClick">{{ localValue }}</span>
    </td>
    <td v-else-if="templateNum == 1" class="border border-gray-700 px-2 md:px-4 py-1 md:py-2">
      <input v-if="isEditing" v-model="localValue" class="bg-gray-700 text-white rounded px-2 py-1" @blur="handleBlur">
      <span v-else @click="handleClick" class="font-bold text-lg md:text-xl mb-2 text-white">{{ localValue }}</span>
    </td>
  </template>
  
  <script>
  export default {
    props: ['value', 'templateNum'],
    data() {
      return {
        localValue: this.value,
        isEditing: false,
      };
    },
    watch: {
      value(newValue) {
        this.localValue = newValue;
      },
    },
    methods: {
      handleClick() {
        this.isEditing = true;
      },
      handleBlur() {
        this.isEditing = false;
        this.$emit('input', this.localValue);
      },
    },
  };
  </script>
  