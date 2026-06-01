<template>
    <td v-if="templateNum != 1" class="px-2 md:px-4 py-1 md:py-2 text-foreground">
      <input
        v-if="isEditing"
        v-model="localValue"
        class="flex h-9 w-full min-w-[4rem] rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        @blur="handleBlur"
      >
      <span v-else class="cursor-pointer hover:text-primary" @click="handleClick">{{ localValue }}</span>
    </td>
    <td v-else-if="templateNum == 1" class="px-2 md:px-4 py-1 md:py-2">
      <input
        v-if="isEditing"
        v-model="localValue"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg font-semibold text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        @blur="handleBlur"
      >
      <span
        v-else
        class="cursor-pointer text-2xl font-semibold leading-none tracking-tight hover:text-primary"
        @click="handleClick"
      >{{ localValue }}</span>
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
