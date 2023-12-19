<script setup>
import { getCurrentBrowserFingerPrint } from '@rajesh896/broprint.js'

definePageMeta({
  layout: 'empty'
})

const route = useRoute()
onBeforeMount(async () => {
  const fingerprint = useCookie('planship-fingerprint')
  fingerprint.value = await getCurrentBrowserFingerPrint()
  console.log(`Redirect ${route.query.callback}`)
  navigateTo(route.query.callback)
})
</script>

<template>
  <NuxtLayout name='empty'/>
</template>
