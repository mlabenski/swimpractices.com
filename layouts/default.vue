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
import AuthModal from '@/components/AuthModal/index.vue'

// The Vuex store is registered via a client-only plugin, so it's absent during
// SSR/prerender and the first client tick. Read it from the Nuxt app context
// (exposed by the plugin as `$store`) rather than Vue's `useStore()`, which
// emits an "injection not found" warning when the store isn't provided yet.
// The auth modal is interactive (no SEO value) and stays client-only.
const { $store: store } = useNuxtApp()
const authModalOpen = computed(
  () => store?.state?.auth?.authModalOpen === true
)
</script>
