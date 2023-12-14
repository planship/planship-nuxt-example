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
      clientPlanshipApiUrl: process.env.PLANSHIP_API_CLIENT_URL || 'https://api.planship.io',
      serverPlanshipApiUrl: process.env.PLANSHIP_API_SERVER_URL || 'https://api.planship.io',
      webSocketUrl: process.env.WEBSOCKET_URL || undefined,
    },
  }
})
