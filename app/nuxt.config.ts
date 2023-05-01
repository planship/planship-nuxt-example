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
                allow: ["/Users/pawel/projects/planship/planship-axios-sdk"]
            }
        }
    }
})
