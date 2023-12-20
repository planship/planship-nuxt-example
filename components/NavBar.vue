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
      <div class="flex items-start md:items-center justify-between py-3">
        <div class="grow flex flex-col md:flex-row">
          <div class="flex items-center flex-row">
            <NuxtLink
              class="block nav-link"
              :class="route.name === 'index' ? 'bg-gray-700' : ''"
              to="/"
            >
              Projects
            </NuxtLink>
            <NuxtLink
              v-if="entitlements.analyticsPanel"
              class="block nav-link"
              :class="route.name === 'analytics' ? 'bg-gray-700' : ''"
              to="/analytics"
            >
              Analytics
            </NuxtLink>
            <NuxtLink
              class="block nav-link"
              :class="route.name === 'subscription' ? 'bg-gray-700' : ''"
              to="/subscription"
            >
              Plans
            </NuxtLink>
          </div>
          <div class="grow" />
          <div class="flex flex-col md:flex-row mt-3 md:mt-0 md:items-center">
            <div class="nav-caption">
              Subscription clicks left: {{ entitlements.subscriptionButtonClicks }}
            </div>
            <div class="nav-caption">
              Clicks left this minute: {{ entitlements.buttonClicksPerMinute }}
            </div>
          </div>
        </div>
        <div class="shrink-0">
          <Menu as="div" class="relative ml-3">
            <MenuButton class="user-btn">
              <span class="sr-only">Open user menu</span>
              <img class="h-8 w-8 rounded-full" :src="currentUser.imageUrl" alt="">
            </MenuButton>
            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
                <MenuItem>
                  <span class="block px-4 py-2 text-sm text-gray-700">Signed in as <b>{{ currentUser.id }}</b></span>
                </MenuItem>
                <MenuItem v-slot="{ active, close }" as="div">
                  <NuxtLink
                    class="block px-4 py-2 text-sm text-gray-700"
                    :class="[active ? 'bg-gray-100' : '']"
                    to="/subscription"
                    @click="close"
                  >
                    My plan: {{ currentPlanName }}
                  </NuxtLink>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>
  </Disclosure>
</template>

<style lang="postcss">
.nav-caption {
  @apply text-gray-400 rounded-md px-2 text-sm font-light;
}

.nav-link {
  @apply border border-gray-500 md:border-none text-gray-300 hover:bg-gray-600 hover:text-white rounded-md mx-1 px-2 py-1 text-sm font-medium;
}

.user-btn {
  @apply flex max-w-xs items-center rounded-full bg-gray-800 text-sm hover:outline-none hover:ring-1 hover:ring-gray-400 hover:ring-offset-2 hover:ring-offset-gray-800;
}
</style>
