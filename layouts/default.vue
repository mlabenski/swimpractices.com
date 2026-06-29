<template>
  <div>
    <ClientOnly>
      <AuthModal :open="authModalOpen" />
    </ClientOnly>
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import AuthModal from '@/components/AuthModal/index.vue'

// The Vuex store is registered via a client-only plugin, so `useStore()` is
// undefined during SSR/prerender. Guard the access and keep the auth modal
// (interactive, no SEO value) client-only.
const store = useStore()
const authModalOpen = computed(
  () => store?.state?.auth?.authModalOpen === true
)
</script>
