<template>
  <div data-title="Dieser Link führt zu Google" class="flex flex-auto items-center gap-x-4 tooltip-wrapper">
    <div v-if="project.type=='Single'" >
      <button
        @click="generateClicks(1)"
        class="inline-flex w-auto justify-center rounded-md px-4 py-2 text-sm font-medium text-white "
        :disabled="! canGenerateButtonClick"
        :class="canGenerateButtonClick ? 'bg-blue-600 bg-opacity-60 hover:bg-opacity-90' : 'bg-gray-400'">
        Generate single click<span class="ml-1" v-if="!canGenerateButtonClick">(No more clicks left)</span>
      </button>
    </div>
    <div v-if="project.type=='Random'">
      <button
        @click="generateClicks(Math.floor(Math.random() * 4) + 1)"
        class="inline-flex w-auto justify-center rounded-md px-4 py-2 text-sm font-medium text-white "
        :disabled="! canGenerateButtonClick"
        :class="canGenerateButtonClick ? 'bg-blue-600 bg-opacity-60 hover:bg-opacity-90' : 'bg-gray-400'"
      >
        Generate random clicks<span class="ml-1" v-if="!canGenerateButtonClick">(No more clicks left)</span>
      </button>
    </div>
    <div v-if="project.type=='Batch'">
      <input v-model="batchClicks" min="1" max = "10" type = "number" class="w-16 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="! canGenerateButtonClick"  name="clicks"/>
      <button
        @click="generateClicks(batchClicks)"
        :disabled="! canGenerateButtonClick"
        class="inline-flex w-auto justify-center rounded-md ml-4 px-4 py-2 text-sm font-medium text-white"
        :class="canGenerateButtonClick ? 'bg-blue-600 bg-opacity-60 hover:bg-opacity-90' : 'bg-gray-400'"
      >
        Generate {{ batchClicks }} clicks<span class="ml-1" v-if="!canGenerateButtonClick">(No more clicks left)</span>
      </button>
    </div>
   </div>
</template>

<script setup lang="ts">
import { Project } from '@/models/project'
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
