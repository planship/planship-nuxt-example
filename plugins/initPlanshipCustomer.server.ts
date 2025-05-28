import type { CustomerSubscriptionWithPlan } from '@planship/fetch'
import { Planship } from '@planship/fetch'

// This plugin initializes a Planship customer if one doesn't already exist for the default user.
// These steps would typically be executed as a part of of customer registration flow, but this example app doesn't
// implement the sign-up/sign-in flow.

export default defineNuxtPlugin(async () => {
  const userId = 'vader@empire.gov'
  const planshipClient = new Planship(
    'clicker-demo',
    {
      clientId: process.env.PLANSHIP_API_CLIENT_ID,
      clientSecret: process.env.PLANSHIP_API_CLIENT_SECRET,
    },
    {
      baseUrl: process.env.PLANSHIP_BASE_URL ?? '',
      webSocketUrl: process.env.PLANSHIP_WEBSOCKET_URL ?? '',
    },
  )
  let customer
  try {
    customer = await planshipClient.getCustomer(userId)
  }
  catch (error) {
    if (error?.response?.status === 404) {
      // Create a Planship customer for the default user if one doesn't exist. This would typically be called during
      // a new customer sign-up, but this example app doesn't implement the sign-up/sign-in flow.
      customer = await planshipClient.createCustomer({ alternativeId: userId })
      console.log(`Created Planship customer for user ${userId}:`, customer.id)
    }
    else if (error?.response?.status === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid Planship Credentials, check your PLANSHIP_API_CLIENT_ID and PLANSHIP_API_CLIENT_SECRET environment variables',
      })
    }
    else {
      throw error
    }
  }
  if (customer) {
    const subscriptions: CustomerSubscriptionWithPlan[] = await planshipClient.listSubscriptions(customer.id)
    if (subscriptions.length === 0) {
      // Create an initial Planship subscription to the Personal plan for the default user if one doesn't exist.
      // This would typically be called when a customer chooses their initial plan upon sign-up, but this example app
      // doesn't implement the sign-up/sign-in flow.
      const subscription = await planshipClient.createSubscription(customer.id, 'personal')
      console.log(`Created initial Planship subscription to plan Personal for user ${userId}:`, subscription.id)
    }
  }
})
