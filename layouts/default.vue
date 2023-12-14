<script setup lang="ts">
import { usePlanshipStore } from '@/stores/planship'

const planshipStore = usePlanshipStore()
await planshipStore.fetchAll()
</script>

<template>
  <div class="flex flex-col  overflow-hidden h-screen">
    <NavBar />
    <div class="flex-grow overflow-y-scroll">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>
