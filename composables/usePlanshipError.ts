// Helper composable to parse and handle Planship errors in a consistent way.
export function usePlanshipError(error: any) {
  const statusCode = error.response?.status || 500
  let statusMessage = error.response?._data?.message || error.message || 'Unknown error'
  if (statusCode === 401) {
    statusMessage = 'Invalid Planship Credentials, check your PLANSHIP_API_CLIENT_ID and PLANSHIP_API_CLIENT_SECRET environment variables'
  }
  return {
    statusCode,
    statusMessage,
  }
}
