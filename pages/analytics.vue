<template>
  <div class="px-4">
    <h1 class="font-bold text-xl mb-2 mt-2">
      Clicks this month
    </h1>
    <pre>{{clickAnalytics}}</pre>
  </div>
</template>

<script setup>

import { usePlanshipStore } from '@/stores/planship'
import { storeToRefs } from 'pinia'

const planshipStore = usePlanshipStore()
const { clickAnalytics } =  storeToRefs(planshipStore)

</script>
