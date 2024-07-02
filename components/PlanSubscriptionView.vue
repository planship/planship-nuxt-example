<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

import {
  RadioGroup,
  RadioGroupDescription,
  RadioGroupLabel,
  RadioGroupOption,
} from '@headlessui/vue'


const isChangingSubscription = ref(false)

const { currentUser } = storeToRefs(useUserStore())

const { apiClient } = await useCurrentPlanshipCustomer()


const { data: plans } = await useAsyncData('plans',
  async () => {
    const planList = await apiClient.listPlans()
    return await Promise.all(planList.map(async ({ slug }) => {
      const plan = await apiClient.getPlan(slug)
      plan.entitlements.sort((a, b) => ((a.order ?? 0) - (b.order ?? 0)))
      return plan
    }))
  }
)

const { data: subscriptions, refresh: refreshSubs } = await useAsyncData('subscriptions',
  async () => {
    return await apiClient.listSubscriptions()
  }
)

const currentSubscription = computed(() => subscriptions.value[0])
const currentPlanSlug = computed(() => currentSubscription.value?.plan.slug)
const planSelection = ref(currentSubscription.value?.plan.slug)

async function changeSubscription(newPlanSlug) {
  isChangingSubscription.value = true

  if (currentSubscription.value?.subscriptionId) {
    await apiClient.modifySubscription(currentSubscription.value.subscriptionId, {
      planSlug: newPlanSlug,
      renewPlanSlug:newPlanSlug,
    })
  }
  else {
    await apiClient.createSubscription(currentUser.value.email, newPlanSlug)
  }

  await refreshSubs()

  // await Promise.all([fetchSubscriptions(true), fetchEntitlements(true)])

  // await modifySubscription(newPlan)
  isChangingSubscription.value = false
}

const changeSubscriptionDisabled = computed(() => planSelection.value === currentPlanSlug.value || isChangingSubscription.value)
</script>

<template>
  <div class="p-4 md:px-16">
    <RadioGroup v-model="planSelection">
      <RadioGroupLabel class="sr-only">
        Plan
      </RadioGroupLabel>
      <div class="flex flex-col md:flex-row justify-between gap-6">
        <RadioGroupOption
          v-for="plan in plans"
          :key="plan.slug"
          v-slot="{ active, checked }"
          as="template"
          :value="plan.slug"
        >
          <div
            :class="[
              active
                ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                : '',
              checked ? 'bg-blue-600 bg-opacity-75 text-white ' : 'bg-white ',
            ]"
            class="md:flex-1 md:flex-grow w-full cursor-pointer p-4 rounded-lg mx-auto text-center shadow-md focus:outline-none"
          >
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
              <p class="font-light my-2">
                {{ plan.description }}
              </p>
              <ul
                v-for="entitlement in plan.entitlements"
                :key="entitlement.name"
                :value="entitlement.name"
                role="list"
                class="mb-1 text-left"
                :class="checked ? 'text-white' : 'text-gray-900'"
              >
                <li class="flex items-center space-x-2">
                  <span v-html="entitlement.name" />
                </li>
              </ul>
            </RadioGroupDescription>
          </div>
        </RadioGroupOption>
      </div>
    </RadioGroup>
    <div class="flex mt-10 justify-end ">
      <button
        class="block md:w-64 w-full rounded-md px-10 py-3 text-base text-white font-medium"
        :class="!changeSubscriptionDisabled ? 'bg-green-500 hover:bg-opacity-90' : 'bg-gray-400'"
        :disabled="changeSubscriptionDisabled"
        @click="changeSubscription(planSelection)"
      >
        Change subscription
      </button>
    </div>
  </div>
</template>
