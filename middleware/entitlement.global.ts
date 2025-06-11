export default defineNuxtRouteMiddleware((to) => {
  const { entitlements } = useCurrentPlanshipCustomer()
  const required = to.meta.entitlement as string | undefined
  if (required && !entitlements.value.entitlementsDict[required]) {
    return navigateTo('/unauthorized')
  }
})
