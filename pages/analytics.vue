<template>
  <div class="flex flex-col pt-20">
    <b class="text-center text-2xl">Clicks this month: {{ clickAnalytics }}</b>
  </div>
</template>

<script setup>

import { usePlanshipStore } from '@/stores/planship'
import { storeToRefs } from 'pinia'

const planshipStore = usePlanshipStore()
const { clickAnalytics } =  storeToRefs(planshipStore)

</script>
