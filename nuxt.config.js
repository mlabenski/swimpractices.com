
export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  target: 'server',
  ssr: true,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'swimpractices',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap'
      }
    ],
    script:[
      { src:'https://www.gstatic.com/firebasejs/7.2.3/firebase-app.js' },
      { src:'https://www.gstatic.com/firebasejs/7.2.3/firebase-firestore.js' },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/static/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/netlify-identity-widget.js', mode: 'client' },
    { src: '~/plugins/touch-events.js', mode: 'client'}
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  googleFonts: {
    families: {
      'Architects Daughter': true
    }
  },



  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/firebase'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'nuxt-material-design-icons',
    '@nuxtjs/eslint-module',
    'bootstrap-vue/nuxt',
    '@nuxtjs/google-fonts',
    '@nuxtjs/firebase',
  ],
  firebase: {
    config: {
      apiKey: process.env.VUE_APP_FIREBASE_apiKey,
      authDomain: process.env.VUE_APP_FIREBASE_authDomain,
      projectId: process.env.VUE_APP_FIREBASE_projectId,
      storageBucket: process.env.VUE_APP_FIREBASE_storageBucket,
      messagingSenderId: process.env.VUE_APP_FIREBASE_messagingSenderId,
      appId: process.env.VUE_APP_FIREBASE_appId,
      measurementId: process.env.VUE_APP_FIREBASE_measurementd
    },
    services: {
      firestore: true
    }
  },
  tailwindcss: {
    configPath: '~/tailwind.config.js'
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  generate: {
    async routes() {
      return dbx.collection('practices').get()
        .then(snapshot => {
          const practices = [];
          snapshot.forEach(doc => {
            practices.push({ id: doc.id, ...doc.data() });
          });
          return practices.map(practice => ({
            route: '/practice/' + practice.id,
            payload: practice
          }));
        });
    }
  }
}
