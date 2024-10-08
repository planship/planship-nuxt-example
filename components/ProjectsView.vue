<script setup>
import { TrashIcon } from '@heroicons/vue/24/outline'

import {
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'

import { storeToRefs } from 'pinia'
import { useProjectsStore } from '@/stores/projects'

const isOpen = ref(false)
const newProjectName = ref('New project')
const newProjectType = ref('Single')

const projectsStore = useProjectsStore()
projectsStore.setCurrentProject('')
const { projects } = storeToRefs(projectsStore)

const { entitlements } = await useCurrentPlanshipCustomer()
const canCreateProject = computed(() => {
  return entitlements.value.maxProjects > projectsStore.projects.length
})

function setCreateDialogOpen(value) {
  isOpen.value = value
}

function createProject() {
  projectsStore.addProject({
    name: newProjectName.value,
    slug: newProjectName.value,
    type: newProjectType.value,
  })
  setCreateDialogOpen(false)
}
function deleteProject(slug) {
  projectsStore.deleteProject(slug)
}
</script>

<template>
  <div class="px-4">
    <div class="project-list" role="list">
      <div
        v-for="project in projects" :key="project.slug"
        class="flex flex-col sm:flex-row gap-1 p-2 my-3 border"
      >
        <div class="flex grow w-full">
          <div class="w-32">
            <p class="project-name">
              {{ project.name }}
            </p>
            <p class="project-type">
              Type: {{ project.type }}
            </p>
          </div>
          <ProjectButtons class="sm:w-64 w-full ml-2" :project="project" />
        </div>
        <div class="grow" />
        <div class="flex grow items-center w-full sm:w-auto justify-center">
          <div class="sm:hidden grow" />
          <div class="w-16 flex justify-end">
            <button type="button" class="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white" @click="deleteProject(project.slug)">
              <span class="sr-only">Delete</span>
              <TrashIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex py-2 justify-stretch">
      <button
        class="create-project-btn"
        :disabled="!canCreateProject"
        @click="setCreateDialogOpen(true)"
      >
        Create new project
      </button>
    </div>
  </div>
  <ClientOnly>
    <Dialog :open="isOpen" @close="setCreateDialogOpen(false)">
      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <DialogPanel
            class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
          >
            <DialogTitle
              as="h3"
              class="text-lg font-medium leading-6 text-gray-900"
            >
              Create a new project
            </DialogTitle>
            <div class="mt-6">
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                  Name
                </label>
                <input v-model="newProjectName" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Project name">
              </div>
              <div class="mb-6">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                  Type
                </label>
                <div class="relative">
                  <select v-model="newProjectType" class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                    <option :disabled="!entitlements.projectTypes.includes('Single')">
                      Single
                    </option>
                    <option :disabled="!entitlements.projectTypes.includes('Random')">
                      Random
                    </option>
                    <option :disabled="!entitlements.projectTypes.includes('Batch')">
                      Batch
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 flex justify-end gap-x-2">
              <button
                type="button"
                class="rounded-md border border-transparent bg-gray-400 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
                @click="setCreateDialogOpen(false)"
              >
                Cancel
              </button>
              <button
                type="button"
                class="rounded-md border border-transparent bg-green-500  px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
                @click="createProject()"
              >
                OK
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  </ClientOnly>
</template>

<style lang="postcss">
.project-name {
  @apply text-sm font-semibold leading-6 text-gray-900;
}

.project-type {
  @apply mt-1 truncate text-xs leading-5 text-gray-500;
}

.project-list li {
  @apply flex justify-between gap-x-6 py-7 px-4 my-3 border;
}

.create-project-btn {
  @apply w-full rounded-md px-3 py-3 text-base text-white font-medium bg-green-500 hover:bg-opacity-90;
}

.create-project-btn:disabled {
  @apply bg-gray-400
}
</style>
