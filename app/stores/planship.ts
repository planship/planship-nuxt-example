import { defineStore } from 'pinia'

import { useUserStore } from '@/stores/user'
import { useProjectsStore } from '@/stores/projects'

import { Planship } from '@planship/axios-client'

const userStore = useUserStore()


function createApiClient() {
  const apiUrl = typeof window === "undefined" ? useRuntimeConfig().public.serverPlanshipApiUrl : useRuntimeConfig().public.clientPlanshipApiUrl
  return new Planship('clicker', apiUrl, '973NYSQ4GQJZ8JBFKIOK', 'RJSazPD8NEM5PEzIl8JoXIRJNZm3uAhX')
}


// This class should come autogenerated by Planship (as a snippet to copy/paste?)
export class Entitlements {

  private entitlementsDict: {} = {
    "subscription-button-clicks": 5,
    "max-projects": 1,
    "premium-button": false,
    "analytics-panel": false,
    "project-types": [ "Single" ]
  }


  constructor(entitlementsDict?: {}) {
    if (entitlementsDict)
      this.entitlementsDict = entitlementsDict;
  }

  get subscriptionButtonClicks(): number {
    return this.entitlementsDict['subscription-button-clicks']
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

export const usePlanshipStore = defineStore('planship', {
  state: () => ({
    subscriptions: [],
    entitlementsDict: {},
    plans: [],
    apiClient: createApiClient(),
  }),

  hydrate(state, initialState) {
    // reacreate the Planship API client one the client side
    state.apiClient = createApiClient()
  },

  getters: {
    defaultSubscription: (state) => state.subscriptions.length > 0 ? state.subscriptions[0] : undefined,
    
    entitlements: (state) => new Entitlements(state.entitlementsDict),

    currentPlanSlug: function () {

      return this.defaultSubscription ? this.defaultSubscription.plan.slug : ''
    },

    currentPlanName: function () {
      return this.defaultSubscription ? this.defaultSubscription.plan.name : ''
    },

    canCreateProject: (state) => {
      const projectsStore = useProjectsStore()
      return state.entitlements.maxProjects > projectsStore.projects.length
    },

    canGenerateButtonClick: (state) => {
      return state.entitlements.subscriptionButtonClicks > 0
    },
  },
  actions: {

    async fetchEntitlements(force: boolean = false) {
      if(!force && this.entitlementsDict && Object.keys(this.entitlementsDict).length)
        return
      this.entitlementsDict = await this.apiClient.getEntitlements(userStore.currentUser.email)
    },

    async fetchSubscriptions(force: boolean = false) {
      if(!force && this.subscriptions && this.subscriptions.length)
        return

      this.subscriptions = await this.apiClient.listSubscriptions(userStore.currentUser.email)
    },

    async fetchPlans(force: boolean = false) {
      if(!force && this.plans && this.plans.length)
        return

      const plans = await this.apiClient.listPlans()
      this.plans = await Promise.all(plans.map(async ({slug}) => {

        const plan = await this.apiClient.getPlan(slug)
        plan.entitlements.sort((a, b) => (a.order-b.order))
        return plan
      }))
    },

    async fetchAll() {
      await this.fetchEntitlements();
      await this.fetchSubscriptions();
      await this.fetchPlans();
    },

    async modifySubscription(newPlanSlug: string) {
      await this.apiClient.modifySubscription(userStore.currentUser.email, this.defaultSubscription.subscription_id, {
        planSlug: newPlanSlug,
        renewPlanSlug: newPlanSlug,
      })
      await this.fetchSubscriptions(true);
      await this.fetchEntitlements(true);
    },

    async reportButtonClicks(count: number) {
      await this.apiClient.reportUsage(userStore.currentUser.email, 'button-click', count)
      await this.fetchEntitlements(true);
    },

    async getTotalButtonClicks() {
      const usage = await this.apiClient.getResourceUsage(userStore.currentUser.email, 'subscription-button-clicks')
      return usage
    }
  },
})