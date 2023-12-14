import type { TokenResponse } from '@planship/fetch'
import { Planship } from '@planship/fetch'

export default defineEventHandler(() => {
  const client = new Planship('clicker-demo', useRuntimeConfig().public.serverPlanshipApiUrl, useRuntimeConfig().public.planshipApiClientId, useRuntimeConfig().planshipApiClientSecret)
  return client.getAccessToken().then((tokenData: TokenResponse) => tokenData.accessToken)
})
