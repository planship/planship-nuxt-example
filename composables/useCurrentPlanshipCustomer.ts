import type { TPlanshipCustomerContextPromiseMixin } from '@planship/nuxt'

// Definition of the entitlements class for the Clicker demo app.
// While optional, this makes it easier to work with your entitlements when using auto-complete in code editors like VS Code.
class ClickerEntitlements extends EntitlementsBase {
  get subscriptionButtonClicks(): number {
    return this.entitlementsDict['subscription-button-clicks'] as number
  }

  get maxProjects(): number {
    return this.entitlementsDict['max-projects'] as number
  }

  get premiumButton(): boolean {
    return this.entitlementsDict['premium-button'] as boolean
  }

  get analyticsPanel(): boolean {
    return this.entitlementsDict['analytics-panel'] as boolean
  }

  get projectTypes(): string[] {
    return this.entitlementsDict['project-types'] as string[]
  }
}

// This composable provides the Planship customer context for the current user.
export default function useCurrentPlanshipCustomer(): TPlanshipCustomerContextPromiseMixin<ClickerEntitlements> {
  const { currentUser } = storeToRefs(useUserStore())

  // Initialize Planship customer context with the current user’s ID (In this case their email - for more info about customer
  // IDs, see https://docs.planship.io/integration/customers/#using-your-own-customer-id), the entitlements type (used for
  // autocomplete in IDEs like VSCode), and initial values to use until entitlements are first retrieved from the Planship API
  return usePlanshipCustomer(currentUser.value.email, ClickerEntitlements, {
    'max-projects': 3,
    'subscription-button-clicks': 0,
    'premium-button': false,
    'analytics-panel': false,
    'project-types': ['default', 'premium'],
  })
}
