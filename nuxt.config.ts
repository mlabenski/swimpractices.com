// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  // Workaround: Nuxt 3.21.3+ dev server regression for SPA mode
  // https://github.com/nuxt/nuxt/issues/34957
  experimental: {
    viteEnvironmentApi: true,
  },

  nitro: {
    preset: 'static',
  },

  dir: {
    public: 'static',
  },

  compatibilityDate: '2025-06-01',

  app: {
    head: {
      title: 'swimpractices',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        },
        { name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
        },
      ],
    },
  },

  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-vue-next/dist/bootstrap-vue-next.css',
    '~/assets/css/shadcn.css',
    '~/static/main.css',
  ],

  modules: ['@nuxtjs/tailwindcss'],

  tailwindcss: {
    configPath: '~/tailwind.config.js',
  },

  runtimeConfig: {
    public: {
      firebaseApiKey:
        process.env.NUXT_PUBLIC_FIREBASE_API_KEY ||
        process.env.VUE_APP_FIREBASE_apiKey ||
        '',
      firebaseAuthDomain:
        process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
        process.env.VUE_APP_FIREBASE_authDomain ||
        '',
      firebaseProjectId:
        process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID ||
        process.env.VUE_APP_FIREBASE_projectId ||
        '',
      firebaseStorageBucket:
        process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
        process.env.VUE_APP_FIREBASE_storageBucket ||
        '',
      firebaseMessagingSenderId:
        process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
        process.env.VUE_APP_FIREBASE_messagingSenderId ||
        '',
      firebaseAppId:
        process.env.NUXT_PUBLIC_FIREBASE_APP_ID ||
        process.env.VUE_APP_FIREBASE_appId ||
        '',
      firebaseMeasurementId:
        process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
        process.env.VUE_APP_FIREBASE_measurementId ||
        '',
    },
  },

  build: {
    transpile: ['class-variance-authority', 'bootstrap-vue-next'],
  },
})
