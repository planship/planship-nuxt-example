import { Planship } from '@planship/fetch'

let planshipClient

async function getAccessToken() {
  return fetch('/api/planshipToken').then(response => response.text())
}

function getPlanshipClient() {
  if (!planshipClient) {
    if (process.server) {
      planshipClient = new Planship(
        'clicker-demo',
        {
          clientId: useRuntimeConfig().public.planshipApiClientId,
          clientSecret: useRuntimeConfig().planshipApiClientSecret
        }
      )
    } else {
      planshipClient = new Planship(
        'clicker-demo',
        getAccessToken
      )
    }
  }

  return planshipClient
}

export default function() {
  return getPlanshipClient()
}
