import { useUserStore } from '@/stores/user'

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log(`Middleware: ${to.path}`)
  if (to.name !== 'fingerprint') {
    const fingerprint = useCookie('planship-fingerprint')
    console.log(`Fingerprint: ${fingerprint?.value}`)
    if (fingerprint?.value === undefined) {
      return navigateTo({
        path: '/fingerprint',
        query: {
          callback: to.path,
        },
      })
    }
    else {
      console.log(`Setting fingerprint to ${fingerprint.value}`)
      const nuxtApp = useNuxtApp()
      const userStore = useUserStore(nuxtApp.$pinia)
      userStore.setUserId(fingerprint.value)
    }
  }
})
