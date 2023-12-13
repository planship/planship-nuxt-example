<template>
  <div class="project">
    <div v-if="project.type=='Single'" >
      <button
        @click="generateClicks(1)"
        class="clicker-btn"
        :disabled="! canGenerateButtonClick"
        :class="canGenerateButtonClick ? 'clicking-enabled' : 'clicking-disabled'">
        Generate single click<span class="ml-1" v-if="!canGenerateButtonClick">(No more clicks left)</span>
      </button>
    </div>
    <div v-if="project.type=='Random'">
      <button
        @click="generateClicks(Math.floor(Math.random() * 4) + 1)"
        class="clicker-btn"
        :disabled="! canGenerateButtonClick"
        :class="canGenerateButtonClick ? 'clicking-enabled' : 'clicking-disabled'"
      >
        Generate random clicks<span class="ml-1" v-if="!canGenerateButtonClick">(No more clicks left)</span>
      </button>
    </div>
    <div v-if="project.type=='Batch'">
      <input v-model="batchClicks" min="1" max = "10" type = "number" class="w-16 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="! canGenerateButtonClick"  name="clicks"/>
      <button
        @click="generateClicks(batchClicks)"
        :disabled="! canGenerateButtonClick"
        class="clicker-btn"
        :class="canGenerateButtonClick ? 'clicking-enabled' : 'clicking-disabled'"
      >
        Generate {{ batchClicks }} clicks<span class="ml-1" v-if="!canGenerateButtonClick">(No more clicks left)</span>
      </button>
    </div>
   </div>
</template>

<script setup lang="ts">
import type { Project } from '@/models/project'
import { usePlanshipStore } from '@/stores/planship'
import { storeToRefs } from 'pinia'
const props =  defineProps<{
  project: Project,
 }>()

const planshipStore = usePlanshipStore()

const { canGenerateButtonClick } = storeToRefs(planshipStore)

const { project } = toRefs(props)
const batchClicks = ref(5)


function generateClicks(count) {
  props.project.usage+=count
  planshipStore.reportButtonClicks(count, props.project.name)
}

</script>

<style lang="postcss">
.clicker-btn {
  @apply inline-flex w-auto justify-center rounded-md px-4 py-2 text-sm font-medium text-white;
}

.clicking-enabled {
  @apply bg-blue-600 bg-opacity-60 hover:bg-opacity-90
}

.clicking-disabled {
  @apply bg-gray-400
}

.project {
  @apply flex flex-auto items-center gap-x-4
}
</style>
