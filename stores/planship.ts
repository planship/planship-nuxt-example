import { defineStore, skipHydrate } from 'pinia'

import { Planship } from '@planship/fetch'
import { useUserStore } from '@/stores/user'
import { useProjectsStore } from '@/stores/projects'

async function getAccessToken() {
  return fetch('/api/planshipToken').then(response => response.text())
}

function createServerApiClient() {
  // Create Planship client using API credentials (server side only)
  return new Planship(
    'clicker-demo',
    useRuntimeConfig().public.serverPlanshipApiUrl,
    useRuntimeConfig().public.planshipApiClientId,
    useRuntimeConfig().planshipApiClientSecret,
    useRuntimeConfig().public.webSocketUrl,
  )
}

function createBrowserApiClient() {
  return new Planship(
    'clicker-demo',
    useRuntimeConfig().public.clientPlanshipApiUrl,
    getAccessToken,
    useRuntimeConfig().public.webSocketUrl,
  )
}

export class Entitlements {
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

export const usePlanshipStore = defineStore('planship', () => {
  const subscriptions = ref([])
  const entitlementsDict = ref({})
  const plans = ref([])
  const clickAnalytics = ref({})
  const currentUser = ref({})

  const userStore = useUserStore()
  const projectsStore = useProjectsStore()
  const { ssrContext } = useNuxtApp()
  const apiClient = ssrContext ? createServerApiClient() : createBrowserApiClient()

  const defaultSubscription = computed(() => subscriptions.value?.[0])

  const entitlements = computed(() => new Entitlements(entitlementsDict.value))

  const currentPlanSlug = computed(() => {
    return defaultSubscription.value?.plan.slug
  })

  const currentPlanName = computed(() => defaultSubscription.value?.plan.name)

  const canCreateProject = computed(() => {
    return entitlements.value.maxProjects > projectsStore.projects.length
  })

  const canGenerateButtonClick = computed(() => entitlements.value.subscriptionButtonClicks > 0 && entitlements.value.buttonClicksPerMinute > 0)

  function updateEntitlementsCb(entitlements) {
    entitlementsDict.value = entitlements
  }

  async function fetchCurrentUser(force: boolean = false) {
    if (!force && currentUser.value?.email)
      return

    try {
      let user
      try {
        user = await apiClient.getCustomer(userStore.currentUser.email)
      }
      catch (error) {
        // If the API response error is different from 404 (customer not found), rethrow it
        if (error.response.status !== 404)
          throw error
      }

      if (!user) {
        // Customer doesn't exist in Planship. register them
        const user = await apiClient.createCustomer({ alternativeId: userStore.currentUser.email })
        await apiClient.createSubscription(user.id, 'personal')
      }
      currentUser.value = user
    }
    catch (error) {
      // Handle Plaship API errors here
      console.dir(error.response)
    }
  }

  async function fetchEntitlements(force: boolean = false) {
    if (!force && Object.keys(entitlementsDict.value).length)
      return

    try {
      const entitlements = await apiClient.getEntitlements(userStore.currentUser.email, updateEntitlementsCb)
      if (entitlements)
        entitlementsDict.value = entitlements
    }
    catch (error) {
      console.dir(error.response)
    }
  }

  async function fetchSubscriptions(force: boolean = false) {
    if (!force && subscriptions.value?.length)
      return

    if (currentUser.value) {
      try {
        subscriptions.value = await apiClient.listSubscriptions(currentUser.value.id)
      }
      catch (error) {
        console.dir(error.response)
      }
    }
  }

  async function fetchPlans(force: boolean = false) {
    if (!force && plans.value?.length)
      return

    const planList = await apiClient.listPlans()
    plans.value = await Promise.all(planList.map(async ({ slug }) => {
      const plan = await apiClient.getPlan(slug)
      plan.entitlements.sort((a, b) => (a.order - b.order))
      return plan
    }))
  }

  async function fetchClickAnalytics(force: boolean = false) {
    if (!force && Object.keys(clickAnalytics.value).length)
      return

    if (currentUser.value) {
      try {
        clickAnalytics.value = await apiClient.getMeteringIdUsage(currentUser.value.id, 'button-click')
      }
      catch (error) {
        console.dir(error.response)
      }
    }
  }

  async function fetchAll(force: boolean = false) {
    return fetchCurrentUser().then(async () => {
      await Promise.all([
        fetchEntitlements(true),
        fetchSubscriptions(force),
        fetchPlans(force),
        fetchClickAnalytics(force),
      ])
    })
  }

  async function modifySubscription(newPlanSlug: string) {
    if (defaultSubscription.value?.subscriptionId) {
      await apiClient.modifySubscription(userStore.currentUser.email, defaultSubscription.value.subscriptionId, {
        planSlug: newPlanSlug,
        renewPlanSlug:
          newPlanSlug,
      })
    }
    else {
      await apiClient.createSubscription(userStore.currentUser.email, newPlanSlug)
    }

    await Promise.all([fetchSubscriptions(true), fetchEntitlements(true)])
  }

  async function reportButtonClicks(count: number, projectName: string) {
    await apiClient.reportUsage(currentUser.value.id, 'button-click', count, projectName)
  }

  return {
    // state
    subscriptions,
    entitlementsDict,
    plans,
    clickAnalytics,
    currentUser,

    // getters
    defaultSubscription,
    entitlements,
    currentPlanSlug,
    currentPlanName,
    canCreateProject,
    canGenerateButtonClick,

    // actions
    reportButtonClicks,
    fetchAll,
    fetchEntitlements,
    fetchSubscriptions,
    fetchPlans,
    fetchClickAnalytics,
    modifySubscription,
    apiClient: skipHydrate(apiClient),
  }
})
