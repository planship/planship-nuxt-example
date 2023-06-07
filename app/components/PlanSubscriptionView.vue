<template>
  <div class="px-16 py-8">
    <RadioGroup v-model="planSelection">
      <RadioGroupLabel class="sr-only">Plan</RadioGroupLabel>
      <div class="flex justify-between gap-x-6 lg:grid lg:grid-cols-3">
        <RadioGroupOption
          as="template"
          v-for="plan in plans"
          :key="plan.slug"
          :value="plan.slug"
          v-slot="{ active, checked }"
        >
          <div
            :class="[
              active
                ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                : '',
              checked ? 'bg-blue-600 bg-opacity-75 text-white ' : 'bg-white ',
            ]"
            class="relative flex cursor-pointer rounded-lg p-2 shadow-md focus:outline-none"
          >
            <div class="flex flex-col items-center p-3 mx-auto max-w-lg text-center">
              <div class="h-8 w-8 text-white mb-5">
                <svg v-show="checked" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="12"
                    fill="#fff"
                    fill-opacity="0.2"
                  />
                  <path
                    d="M7 13l3 3 7-7"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div class="flex flex-col items-center">
                <RadioGroupLabel
                  as="p"
                  :class="checked ? 'text-white' : 'text-gray-900'"
                  class="text-2xl font-semibold"
                >
                  {{ plan.name }}
                </RadioGroupLabel>
                <RadioGroupDescription
                  as="div"
                  :class="checked ? 'text-sky-100' : 'text-gray-500'"
                  class="inline"
                >
                  <p class="font-light my-4">{{ plan.description }}</p>
                  <ul
                    v-for="entitlement in plan.entitlements"
                    :key="entitlement.name"
                    :value="entitlement.name"
                    role="list" class="mb-1 space-y-1 text-left" :class="checked ? 'text-white' : 'text-gray-900'"
                  >
                    <li class="flex items-center space-x-2">
                        <span v-html="entitlement.display_caption" />
                    </li>
                  </ul>
                </RadioGroupDescription>
              </div>
            </div>
          </div>
        </RadioGroupOption>
      </div>
    </RadioGroup>
    <div class="flex mt-10 justify-end">
      <button
        class="rounded-md px-10 py-3 text-med text-white font-medium"
        :class="currentPlanSlug != planSelection ? 'bg-green-500 hover:bg-opacity-90': 'bg-gray-400'"
        :disabled="currentPlanSlug == planSelection"
        @click="modifySubscription(planSelection)"
      >
        Change subscription
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePlanshipStore } from '@/stores/planship'
import { storeToRefs } from 'pinia'

import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupDescription,
  RadioGroupOption,
} from '@headlessui/vue'

const planshipStore = usePlanshipStore()
await planshipStore.fetchAll()

const { modifySubscription } = planshipStore

const { currentPlanSlug, plans } = storeToRefs(planshipStore)
const planSelection = ref(planshipStore.currentPlanSlug)

</script>
