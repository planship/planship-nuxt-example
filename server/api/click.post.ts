import usePlanship from '~/composables/usePlanship.ts'

export default defineEventHandler(async (event) => {
  const planship = usePlanship()
  const body = await readBody(event)

  /*
  Check entitlements to see if this user can perform this action. It's important to check entitlements
  both on the front-end in order to visually inform users AND the backend for the final decision on whether to
  perform an action or not.
  */
  const entitlements = await planship.getEntitlements(body.userId)
  if (entitlements['subscription-button-clicks'] <= 0 || entitlements['button-clicks-per-minute'] <= 0) {
    console.log('Error: Insufficient clicks')
    throw createError({
      statusCode: 403,
      statusMessage: 'Insufficient clicks available'
    })
  }

  // Business logic
  console.log('Success: New Click!')

  // Report usage to Planship
  return planship.reportUsage(body.userId, 'button-click', body.count, body.projectName)
})
