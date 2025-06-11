<script setup>
definePageMeta({
  middleware: ['entitlement'],
  entitlement: 'analytics-panel',
})
const { planshipCustomerApiClient } = useCurrentPlanshipCustomer()

const { data: clickAnalytics } = await useLazyAsyncData('clickAnalytics', async () => {
  return await planshipCustomerApiClient.getMeteringIdUsage('button-click')
})
</script>

<template>
  <div class="px-4">
    <h1 class="font-bold text-xl my-2">
      Clicks this month
    </h1>
    <pre>{{ clickAnalytics }}</pre>
  </div>
</template>
