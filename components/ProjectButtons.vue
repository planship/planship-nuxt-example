<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Project } from '@/models/project'

const props = defineProps<{
  project: Project
}>()

const { currentUser } = storeToRefs(useUserStore())

const { entitlements } = await useCurrentPlanshipCustomer()

const canGenerateButtonClick = computed(() => (entitlements.value?.subscriptionButtonClicks ?? 0) > 0)

const { project } = toRefs(props)
const batchClicks = ref(5)

function generateClicks(count: number) {
  try {
    $fetch('api/click', {
      method: 'post',
      body: {
        userId: currentUser.value.email,
        count,
        projectName: props.project.name,
      },
    })
  }
  catch (error) {
    // Handle error
    console.dir(error)
  }
}
</script>

<template>
  <div>
    <div v-if="project.type === 'Single'">
      <button
        class="clicker-btn"
        :disabled="!canGenerateButtonClick"
        @click="generateClicks(1)"
      >
        Generate single click<span v-if="!canGenerateButtonClick" class="ml-1">(No more clicks left)</span>
      </button>
    </div>
    <div v-if="project.type === 'Random'">
      <button
        class="clicker-btn"
        :disabled="!canGenerateButtonClick"
        @click="generateClicks(Math.floor(Math.random() * 4) + 1)"
      >
        Generate random clicks<span v-if="!canGenerateButtonClick" class="ml-1">(No more clicks left)</span>
      </button>
    </div>
    <div v-if="project.type === 'Batch'" class="flex gap-x-1">
      <input
        v-model="batchClicks"
        min="1"
        max="10"
        type="number"
        class="w-16 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        :disabled="!canGenerateButtonClick"
        name="clicks"
      >
      <button
        :disabled="!canGenerateButtonClick"
        class="clicker-btn"
        @click="generateClicks(batchClicks)"
      >
        Generate {{ batchClicks }} clicks<span v-if="!canGenerateButtonClick" class="ml-1">(No more clicks left)</span>
      </button>
    </div>
  </div>
</template>

<style lang="postcss">
.clicker-btn {
  @apply block w-full rounded-md px-4 py-2 text-sm font-medium text-white bg-blue-600 bg-opacity-60 hover:bg-opacity-90;
}

.clicker-btn:disabled {
  @apply bg-gray-400
}
</style>
