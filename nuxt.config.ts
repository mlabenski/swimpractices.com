// https://nuxt.com/docs/api/configuration/nuxt-config

// Single source of truth for the canonical site URL. Used by the sitemap and
// robots modules (via `site.url`) and by in-app canonical/OG tags (via
// `runtimeConfig.public.siteUrl`). Override per environment with NUXT_PUBLIC_SITE_URL.
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://swimpractices.com'

export default defineNuxtConfig({
  ssr: true,

  site: {
    url: siteUrl,
    name: 'SwimPractices',
  },

  // Workaround: Nuxt 3.21.3+ dev server regression for SPA mode
  // https://github.com/nuxt/nuxt/issues/34957
  experimental: {
    viteEnvironmentApi: true,
  },

  nitro: {
    preset: 'static',
  },

  // Hybrid rendering for a static deploy: prerender the marketing pages to real
  // HTML (crawlable meta + content); everything else falls back to the SPA shell.
  routeRules: {
    '/': { prerender: true },
    '/privacy': { prerender: true },
    '/roadmap': { prerender: true },
    '/support': { prerender: true },
    // Interactive practice player duplicates /[id]; keep it client-only.
    '/practice/**': { ssr: false },
  },

  dir: {
    public: 'static',
  },

  compatibilityDate: '2025-06-01',

  app: {
    head: {
      title: 'SwimPractices — Free AI Swim Practice Generator',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        },
        {
          name: 'description',
          content:
            'Free AI-generated swim practices and workouts. Browse, customize, and track swim sets for every stroke, distance, and skill level.',
        },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#0B1220' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
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

  // @nuxtjs/robots auto-generates robots.txt (allow-all in production) and
  // @nuxtjs/sitemap generates /sitemap.xml (auto-discovers static routes; the
  // dynamic /[id] practice URLs are added as a source in a later phase).
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap', '@nuxtjs/robots'],

  // robots.txt config. Top-level rules form the default `User-agent: *` group;
  // `groups` adds explicit per-crawler groups.
  robots: {
    // Keep the duplicate practice-player path out of search results.
    disallow: ['/practice/'],
    groups: [
      {
        // Explicitly welcome AI/LLM crawlers. Same crawl scope as everyone
        // else (the client-only /practice/ duplicate stays excluded).
        comment: ['Explicitly allow AI / LLM crawlers'],
        userAgent: [
          'GPTBot', // OpenAI training
          'ChatGPT-User', // ChatGPT on-demand fetch
          'OAI-SearchBot', // OpenAI search
          'ClaudeBot', // Anthropic
          'Claude-Web',
          'Claude-SearchBot',
          'anthropic-ai',
          'PerplexityBot', // Perplexity
          'Perplexity-User',
          'Google-Extended', // Gemini / Vertex training
          'Applebot-Extended', // Apple Intelligence
          'Amazonbot',
          'Bytespider', // ByteDance
          'Meta-ExternalAgent', // Meta AI
          'FacebookBot',
          'cohere-ai',
          'DuckAssistBot',
          'YouBot',
          'CCBot', // Common Crawl (feeds many LLM datasets)
        ],
        allow: ['/'],
        disallow: ['/practice/'],
      },
    ],
  },

  tailwindcss: {
    configPath: '~/tailwind.config.js',
  },

  runtimeConfig: {
    public: {
      siteUrl,
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
