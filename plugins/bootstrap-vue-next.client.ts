import { createBootstrap } from 'bootstrap-vue-next'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createBootstrap())
})
