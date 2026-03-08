<template>
  <div>
    <AuthModal :open="authModalOpen" />
    <nuxt />
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import AuthModal from "@/components/AuthModal/index.vue"

export default {
  components: { AuthModal },
  computed: {
    ...mapGetters("auth", ["authModalOpen"]),
  },
}
</script>
