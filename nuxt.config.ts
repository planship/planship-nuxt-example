// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    '@/assets/css/main.css',
  ],

  experimental: {
    renderJsonPayloads: false,
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@planship/nuxt',
  ],

  planship: {
    productSlug: 'clicker-demo',
    clientId: process.env.PLANSHIP_CLIENT_ID,
    clientSecret: process.env.PLANSHIP_CLIENT_SECRET,
  },

  devtools: {
    enabled: false,
  },

  compatibilityDate: '2024-07-12',
})
