// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	css: [
  	'@/assets/css/main.css',
	],

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

  vite: {
        server: {
            fs: {
                allow: ["/Users/pawelwojnarowicz/projects/planship/planship-axios-sdk"]
            }
        }
  },

  runtimeConfig: {
    planshipApiClientSecret: process.env.PLANSHIP_API_CLIENT_SECRET || 'RJSazPD8NEM5PEzIl8JoXIRJNZm3uAhX',

    public: {
      planshipApiClientId: process.env.PLANSHIP_API_CLIENT_ID || '973NYSQ4GQJZ8JBFKIOK',
      clientPlanshipApiUrl: process.env.PLANSHIP_API_CLIENT_URL || 'http://localhost:8002',
      serverPlanshipApiUrl: process.env.PLANSHIP_API_SERVER_URL || 'http://main:8002',
    },
  }
})
