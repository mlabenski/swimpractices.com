export default defineNuxtPlugin({
  dependsOn: ['vuex'],
  setup (nuxtApp) {
    const store = nuxtApp.$store
    store.dispatch('nuxtClientInit')
  },
})
