<template>
  <div class="flex flex-col pt-20">
    <b class="text-center text-2xl">Clicks this month: {{ totalClicks }}</b>
  </div>
</template>

<script setup>

import { usePlanshipStore } from '@/stores/planship'

const planshipStore = usePlanshipStore()

const totalClicks = await planshipStore.getTotalButtonClicks()

</script>
