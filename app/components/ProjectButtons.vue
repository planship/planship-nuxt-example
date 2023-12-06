<template>
  <div v-if="project.type=='Single'" class="flex flex-auto items-center gap-x-4">
  	<button @click="project.usage++" class="inline-flex w-auto justify-center rounded-md bg-blue-600 bg-opacity-60 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 ">Generate single click</button>
  </div>
  <div v-if="project.type=='Random'" class="flex flex-auto items-center gap-x-4">
  	<button @click="project.usage+=Math.floor(Math.random() * 4) + 1;" class="inline-flex w-auto justify-center rounded-md bg-blue-600 bg-opacity-60 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 ">Generate random clicks</button>
  </div>
  <div v-if="project.type=='Batch'" class="flex flex-auto items-center gap-x-4">
  	<input v-model="batchClicks" min="1" max = "10" type = "number" class="w-16 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="clicks"/>
  	<button @click="project.usage+=batchClicks" class="inline-flex w-auto justify-center rounded-md bg-blue-600 bg-opacity-60 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 ">Generate {{ batchClicks }} clicks</button>
  </div>
</template>

<script setup lang="ts">
import { Project } from '@/models/project'

const projectTypes = [
	"Single",
	"Random",
	"Batch"
]

const props =  defineProps<{
    project: Project,
 }>()

const { project } = toRefs(props)
const batchClicks = ref(5)

</script>