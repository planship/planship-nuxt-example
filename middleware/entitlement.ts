// The middleware checks if the user has the Planship entitlemen required to access a route.
// The name of the entitlement is specified in the route's meta field as `entitlement`.
// If the user does not have the required entitlement, they are redirected to an unauthorized page.
export default defineNuxtRouteMiddleware((to) => {
  const { entitlements } = useCurrentPlanshipCustomer()
  const required = to.meta.entitlement as string | undefined
  if (required && !entitlements.value.entitlementsDict[required]) {
    return navigateTo('/unauthorized')
  }
})
