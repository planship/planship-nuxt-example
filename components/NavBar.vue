<script setup>
import { storeToRefs } from 'pinia'
import { Disclosure, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { useUserStore } from '@/stores/user'
import { usePlanshipStore } from '@/stores/planship'

const route = useRoute()

const { currentUser } = storeToRefs(useUserStore())

const planshipStore = usePlanshipStore()

const { currentPlanName, entitlements } = storeToRefs(planshipStore)
</script>

<template>
  <Disclosure as="nav" class="bg-gray-800 text-gray-300">
    <div class="mx-auto max-w-full px-4">
      <div class="flex items-start justify-between py-4">
        <div class="grow">
          <div class="flex flex-col md:flex-row">
            <div
              class="nav-link order-0"
              :class="route.name === 'index' ? 'bg-gray-700' : ''"
            >
              <NuxtLink
                class="block"
                to="/"
              >
                Projects
              </NuxtLink>
            </div>
            <div v-if="entitlements.analyticsPanel" class="nav-link grow-0 order-2" :class="route.name === 'analytics' ? 'bg-gray-700' : ''">
              <NuxtLink
                class="block"
                to="/analytics"
              >
                Analytics
              </NuxtLink>
            </div>
            <div class="grow order-3" />
            <div class="nav-caption order-4">
              Subscription clicks left: {{ entitlements.subscriptionButtonClicks }}
            </div>
            <div class="nav-caption order-5">
              Clicks left this minute: {{ entitlements.buttonClicksPerMinute }}
            </div>
            <div class="nav-link order-2 md:order-last" :class="route.name === 'subscription' ? 'bg-gray-700' : ''">
              <NuxtLink class="block" to="/subscription" aria-current="undefined">
                Current plan: {{ currentPlanName }}
              </NuxtLink>
            </div>
          </div>
        </div>
        <div>
          <Menu as="div" class="relative ml-3">
            <MenuButton class="user-btn">
              <span class="sr-only">Open user menu</span>
              <img class="h-8 w-8 rounded-full" :src="currentUser.imageUrl" alt="">
            </MenuButton>
            <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
              <div class="px-1 py-1 ">
                <MenuItem>
                  <span class="block px-4 py-2 text-sm text-gray-700">Signed in as <b>{{ currentUser.name }}</b></span>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </div>
  </Disclosure>
</template>

<style lang="postcss">
.nav-caption {
  @apply text-gray-400 rounded-md px-3 pt-2 text-sm font-light;
}

.nav-link {
  @apply text-gray-300 hover:bg-gray-600 hover:text-white rounded-md px-3 py-2 text-sm font-medium;
}

.user-btn {
  @apply flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800;
}
</style>
