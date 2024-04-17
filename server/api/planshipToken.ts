import type { TokenResponse } from '@planship/fetch'
import usePlanship from '~/composables/usePlanship.ts'

export default defineEventHandler(() => {
  const planship = usePlanship()
  return planship.getAccessToken().then((tokenData: TokenResponse) => tokenData.accessToken)
})
