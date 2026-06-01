import { createStore } from 'vuex'
import { createRootStore } from '~/store/createStore'

export default defineNuxtPlugin({
  name: 'vuex',
  dependsOn: ['firebase', 'axios'],
  setup (nuxtApp) {
    const store = createStore(createRootStore())

    Object.assign(store, {
      $fire: nuxtApp.$fire,
      $fireModule: nuxtApp.$fireModule,
      $firebaseAuth: nuxtApp.$firebaseAuth,
      $netlifyIdentity: nuxtApp.$netlifyIdentity,
      $axios: nuxtApp.$axios,
    })

    nuxtApp.vueApp.use(store)

    return {
      provide: {
        store,
      },
    }
  },
})
