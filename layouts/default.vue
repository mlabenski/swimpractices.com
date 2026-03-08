<template>
  <div>
    <AuthModal :open="authModalOpen" />
    <nuxt />
  </div>
</template>

<script>
import { mapState } from "vuex"
import AuthModal from "@/components/AuthModal/index.vue"

export default {
  components: { AuthModal },
  computed: {
    ...mapState({
      authModalOpen: (state) => state.auth && state.auth.authModalOpen === true,
    }),
  },
}
</script>
