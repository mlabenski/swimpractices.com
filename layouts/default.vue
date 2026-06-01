<template>
  <div>
    <AuthModal :open="authModalOpen" />
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import AuthModal from '@/components/AuthModal/index.vue'

const store = useStore()
const authModalOpen = computed(
  () => store.state.auth?.authModalOpen === true
)
</script>
