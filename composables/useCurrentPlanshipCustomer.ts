import type { TPlanshipCustomerContextPromiseMixin } from '@planship/nuxt'

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

export default function useCurrentPlanshipCustomer(): TPlanshipCustomerContextPromiseMixin<ClickerEntitlements> {
  const { currentUser } = storeToRefs(useUserStore())
  return usePlanshipCustomer(currentUser.value.email, ClickerEntitlements)
}
