export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'swimpractices',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/netlify-identity-widget.js', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,



  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'nuxt-material-design-icons',
    '@nuxtjs/firebase'
  ],
  firebase: {
    config: {
      apiKey: process.env.VUE_APP_FIREBASE_apiKey,
      authDomain: process.env.VUE_APP_FIREBASE_authDomain,
      projectId: process.env.VUE_APP_FIREBASE_projectId,
      storageBucket: process.env.VUE_APP_FIREBASE_storageBucket,
      messagingSenderId: process.env.VUE_APP_FIREBASE_messagingSenderId,
      appId: process.env.VUE_APP_FIREBASE_appId,
      measurementId: process.env.VUE_APP_FIREBASE_measurementd,
    },
    tailwindcss: {
      configPath: '~/tailwind.config.js'
    },
    services: {
      firestore: true
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
