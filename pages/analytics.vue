<script setup>
import { storeToRefs } from 'pinia'

const { clickAnalytics } = {}
</script>

<template>
  <div class="px-4">
    <h1 class="font-bold text-xl my-2">
      Clicks this month
    </h1>
    <pre>{{ clickAnalytics }}</pre>
  </div>
</template>
