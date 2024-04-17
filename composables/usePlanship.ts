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
        },
        {
          baseUrl: useRuntimeConfig().public.planshipApiServerUrl,
        }
      )
    } else {
      planshipClient = new Planship(
        'clicker-demo',
        getAccessToken,
        {
          baseUrl: useRuntimeConfig().public.planshipApiClientUrl,
          webSocketUrl: useRuntimeConfig().public.planshipApiWebsocketUrl,
        }
      )
    }
  }

  return planshipClient
}

export default function() {
  return getPlanshipClient()
}
