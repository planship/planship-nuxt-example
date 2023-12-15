
import { useUserStore } from '@/stores/user'


export default defineNuxtRouteMiddleware(async (to, from) => {

    if (process.server && to.name !== 'fingerprint') {
      const fingerprint = useCookie('planship-fingerprint')
      if (fingerprint.value === undefined) {
        return navigateTo({
          path: '/fingerprint',
          query: {
            callback: from.path,
          }
        })
      } else {
        useUserStore().setUserId(fingerprint.value)
      }
    }
  })
