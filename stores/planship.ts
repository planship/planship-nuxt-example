import { defineStore, skipHydrate } from 'pinia'

import { useUserStore } from '@/stores/user'
import { useProjectsStore } from '@/stores/projects'

import { Planship } from '@planship/fetch'

async function getAccessToken() {
  return fetch('/api/planshipToken').then((response) => response.text())
}

function getApiUrl() {
  return typeof window === "undefined" ? useRuntimeConfig().public.serverPlanshipApiUrl : useRuntimeConfig().public.clientPlanshipApiUrl
}

function createServerApiClient() {
  return new Planship(
    'clicker',
    getApiUrl(),
    useRuntimeConfig().public.planshipApiClientId ,
    useRuntimeConfig().planshipApiClientSecret,
    useRuntimeConfig().public.webSocketUrl,
  )
}

function createBrowserApiClient() {
  return new Planship('clicker', getApiUrl(), getAccessToken, useRuntimeConfig().public.webSocketUrl)
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

export const usePlanshipStore = defineStore('planship', () => {

    const subscriptions = ref([])
    const entitlementsDict = ref({})
    const plans = ref([])
    const clickAnalytics = ref({})


    const userStore = useUserStore()
    const projectsStore = useProjectsStore()
    const { ssrContext } = useNuxtApp();
    const apiClient = ssrContext ? createServerApiClient() : createBrowserApiClient();

    const defaultSubscription = computed(() => subscriptions.value.length > 0 ? subscriptions.value[0] : undefined)

    const entitlements = computed(() => new Entitlements(entitlementsDict.value))

    const currentPlanSlug = computed(() => {
      return defaultSubscription.value ? defaultSubscription.value.plan.slug : ''
    })

    const currentPlanName = computed(() => defaultSubscription.value ? defaultSubscription.value.plan.name : '')

    const canCreateProject = computed(() => {
      return entitlements.value.maxProjects > projectsStore.projects.length
    })

    const canGenerateButtonClick = computed(() => entitlements.value.subscriptionButtonClicks > 0)

    function updateEntitlementsCb(entitlements) {
      entitlementsDict.value = entitlements
    }

    async function fetchEntitlements(force: boolean = false) {

      if(!force && entitlementsDict.value && Object.keys(entitlementsDict.value).length)
        return

      entitlementsDict.value = await apiClient.getEntitlements(userStore.currentUser.email, updateEntitlementsCb)
    }

    async function fetchSubscriptions(force: boolean = false) {
      if(!force && subscriptions.value && subscriptions.value.length)
        return
      subscriptions.value = await apiClient.listSubscriptions(userStore.currentUser.email)
    }

    async function fetchPlans(force: boolean = false) {
      if(!force && plans.value && plans.value.length)
        return

      const planList = await apiClient.listPlans()
      plans.value = await Promise.all(planList.map(async ({slug}) => {
        const plan = await apiClient.getPlan(slug)
        plan.entitlements.sort((a, b) => (a.order-b.order))
        return plan
      }))
    }

    async function fetchClickAnalytics(force: boolean = false) {
      if(!force && clickAnalytics.value && Object.keys(clickAnalytics.value).length)
        return

      clickAnalytics.value = await apiClient.getMeteringIdUsage(userStore.currentUser.email, 'button-click')
    }

    async function fetchAll() {
      await fetchEntitlements(true);
      await fetchSubscriptions();
      await fetchPlans();
      await fetchClickAnalytics();
    }

    async function modifySubscription(newPlanSlug: string) {
      await apiClient.modifySubscription(userStore.currentUser.email, defaultSubscription.value.subscriptionId, {
        planSlug: newPlanSlug,
        renewPlanSlug: newPlanSlug,
      })
      await fetchSubscriptions(true);
      await fetchEntitlements(true);
    }

    async function reportButtonClicks(count: number, projectName: string) {
      await apiClient.reportUsage(userStore.currentUser.email, 'button-click', count, projectName)
    }

    return {
      subscriptions,
      entitlementsDict,
      plans,
      clickAnalytics,
      defaultSubscription,
      entitlements,
      currentPlanSlug,
      currentPlanName,
      canCreateProject,
      canGenerateButtonClick,
      reportButtonClicks,
      fetchAll,
      fetchEntitlements,
      fetchSubscriptions,
      fetchPlans,
      fetchClickAnalytics,
      modifySubscription,
      apiClient: skipHydrate(apiClient)
    }


})
