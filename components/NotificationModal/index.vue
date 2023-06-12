<template>
  <div class="fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50" v-if="isNotificationModalOpen">
    <div class="bg-white rounded p-5">
      <h2 class="text-xl mb-4">{{ notification.title }}</h2>
      <p>{{ notification.description }}</p>
      <button @click="closeModal" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isNotificationModalOpen: {
      type: Boolean,
      required: true
    },
    notification: {
      type: Object,
      required: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    }
  }
}
</script>
