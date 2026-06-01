import netlifyIdentity from 'netlify-identity-widget'

export default defineNuxtPlugin({
  name: 'netlify-identity',
  dependsOn: ['vuex'],
  setup (nuxtApp) {
    nuxtApp.provide('netlifyIdentity', netlifyIdentity)
    const store = nuxtApp.$store as { dispatch: (type: string) => Promise<void> }
    store.dispatch('auth/init')
  },
})
