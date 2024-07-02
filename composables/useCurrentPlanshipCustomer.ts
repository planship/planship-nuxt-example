import { usePlanshipCustomer } from '@planship/vue'

class ClickerEntitlements {
    private entitlementsDict: { [key: string]: string | number | boolean | string[] } = {
      'subscription-button-clicks': 0,
      'button-clicks-per-minute': 0,
      'max-projects': 0,
      'premium-button': false,
      'analytics-panel': false,
      'project-types': ['Single'],
    }

    constructor(entitlementsDict?: {}) {
      if (entitlementsDict)
        this.entitlementsDict = entitlementsDict
    }

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



  export default async function () {
    const { currentUser } = storeToRefs(useUserStore())
    return usePlanshipCustomer(currentUser.value.email, ClickerEntitlements)
  }
