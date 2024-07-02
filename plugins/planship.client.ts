import { PlanshipPlugin } from '@planship/vue'
import { getAccessToken } from '../composables/usePlanship'

async function getAccessToken() {
  return fetch('/api/planshipToken').then(response => response.text())
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(
    PlanshipPlugin, {
      slug: 'clicker-demo',
      auth: getAccessToken,
    },

  )
})
