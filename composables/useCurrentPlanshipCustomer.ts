class ClickerEntitlements extends EntitlementsBase {
  get subscriptionButtonClicks(): number {
    return this.entitlementsDict['subscription-button-clicks']
  }

  get buttonClicksPerMinute(): number {
    return this.entitlementsDict['button-clicks-per-minute']
  }

  get maxProjects(): number {
    return this.entitlementsDict['max-projects']
  }

  get premiumButton(): boolean {
    return this.entitlementsDict['premium-button']
  }

  get analyticsPanel(): boolean {
    return this.entitlementsDict['analytics-panel']
  }

  get projectTypes(): [] {
    return this.entitlementsDict['project-types']
  }
}

export default function useCurrentPlanshipCustomer() {
  const { currentUser } = storeToRefs(useUserStore())
  return usePlanshipCustomer(currentUser.value.email, ClickerEntitlements)
}
