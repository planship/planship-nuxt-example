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
  ],

  runtimeConfig: {
    planshipApiClientSecret: process.env.PLANSHIP_API_CLIENT_SECRET,

    public: {
      planshipApiClientId: process.env.PLANSHIP_API_CLIENT_ID,
    },
  },
})
