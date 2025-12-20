// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/image',
    '@nuxt/content',
    '@nuxt/ui',
    'nuxt-studio',
  ],

  css: ['~/assets/css/main.css'],

  ui: {
    colorMode: false
  },

  routeRules: {
    '/articles/**': { prerender: true },
    '/': { prerender: true },
  },

  studio: {
    repository: {
      provider: 'github',
      owner: 'ebanDev',
      repo: 'portfolio-v3',
      branch: 'main'
    },
    dev: false,
  },
})
