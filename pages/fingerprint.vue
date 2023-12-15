<script setup>
import { getCurrentBrowserFingerPrint } from '@rajesh896/broprint.js';
const route = useRoute()

onBeforeMount(async () => {
    const fingerprint = useCookie('planship-fingerprint')
    fingerprint.value = await getCurrentBrowserFingerPrint()
    navigateTo(route.query['callback'])
  });

</script>

<template></template>
