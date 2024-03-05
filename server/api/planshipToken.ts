import usePlanship from '~/composables/usePlanship.ts'
import type { TokenResponse } from '@planship/fetch'

export default defineEventHandler(() => {
  const planship = usePlanship()
  return planship.getAccessToken().then((tokenData: TokenResponse) => tokenData.accessToken)
})
