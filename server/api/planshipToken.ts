import { Planship, TokenResponse } from '@planship/fetch';

export default defineEventHandler((event) => {
  const client = new Planship('clicker-demo', useRuntimeConfig().public.serverPlanshipApiUrl, useRuntimeConfig().public.planshipApiClientId , useRuntimeConfig().planshipApiClientSecret)
  return client.getAccessToken().then((tokenData: TokenResponse) => tokenData.accessToken)
})
