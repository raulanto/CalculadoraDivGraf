// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: "light",
  },
  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15'


})
