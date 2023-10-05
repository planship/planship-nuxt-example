import { Planship } from '@planship/axios-client'

export default defineEventHandler((event) => {
  const client = new Planship('clicker', useRuntimeConfig().public.serverPlanshipApiUrl, '973NYSQ4GQJZ8JBFKIOK', 'RJSazPD8NEM5PEzIl8JoXIRJNZm3uAhX')
  return client.getAccessToken().then((data) => data.access_token)
})