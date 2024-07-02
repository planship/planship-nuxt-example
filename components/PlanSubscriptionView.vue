<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import {
  RadioGroup,
  RadioGroupDescription,
  RadioGroupLabel,
  RadioGroupOption,
} from '@headlessui/vue'

const isChangingSubscription = ref(false)

const { currentUser } = storeToRefs(useUserStore())

const { planshipCustomerApiClient, fetchEntitlements } = useCurrentPlanshipCustomer()

const { data: plans, status: plansStatus } = await useLazyAsyncData('plans', async () => {
  return planshipCustomerApiClient.listPlans().then(planList =>
    Promise.all(planList.map(async ({ slug }) => {
      const plan = await planshipCustomerApiClient.getPlan(slug)
      plan.entitlements.sort((a, b) => ((a.order ?? 0) - (b.order ?? 0)))
      return plan
    })),
  )
})

const isPlansLoading = computed(() => plansStatus.value === 'pending' && plans.value === null)

const { data: subscriptions, refresh: refreshSubs } = await useLazyAsyncData('subscriptions', async () => {
  return planshipCustomerApiClient.listSubscriptions()
})

const currentSubscription = computed(() => subscriptions.value?.[0])
const currentPlanSlug = computed(() => currentSubscription.value?.plan.slug)
const planSelection = ref(currentSubscription.value?.plan.slug)

async function changeSubscription(newPlanSlug) {
  isChangingSubscription.value = true

  if (currentSubscription.value?.subscriptionId) {
    await planshipCustomerApiClient.modifySubscription(currentSubscription.value.subscriptionId, {
      planSlug: newPlanSlug,
      renewPlanSlug: newPlanSlug,
    })
  }
  else {
    const customer = await planshipCustomerApiClient.createCustomer({ alternativeId: currentUser?.value?.email })
    await planshipCustomerApiClient.createSubscription(customer.id, newPlanSlug)
  }

  await Promise.all([refreshSubs(), fetchEntitlements()])
  isChangingSubscription.value = false
}

const changeSubscriptionDisabled = computed(() => planSelection.value === currentPlanSlug.value || isChangingSubscription.value)
</script>

<template>
  <span v-if="isPlansLoading">Loading plans ...</span>
  <div class="p-4 md:px-16">
    <RadioGroup id="radio-group-plans" v-model="planSelection">
      <RadioGroupLabel id="radio-group-label-plans" class="sr-only">
        Plan
      </RadioGroupLabel>
      <div class="flex flex-col md:flex-row justify-between gap-6">
        <RadioGroupOption
          v-for="plan in plans"
          :id="`radio-group-option-${plan.slug}`"
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
              :id="`radio-group-label-${plan.slug}`"
              as="p"
              :class="checked ? 'text-white' : 'text-gray-900'"
              class="text-2xl font-semibold"
            >
              {{ plan.name }}
            </RadioGroupLabel>
            <RadioGroupDescription
              :id="`radio-group-description-${plan.slug}`"
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
