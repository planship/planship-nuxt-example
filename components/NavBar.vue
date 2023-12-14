<script setup>
import { storeToRefs } from 'pinia'
import { Disclosure, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { useUserStore } from '@/stores/user'
import { usePlanshipStore } from '@/stores/planship'

const { currentUser } = storeToRefs(useUserStore())

const planshipStore = usePlanshipStore()

const { currentPlanName, entitlements } = storeToRefs(planshipStore)

function setCreateDialogOpen(value) {
  isOpen.value = value
}

if (!currentUser)
  setCreateDialogOpen(true)
</script>

<template>
  <Disclosure as="nav" class="bg-gray-800">
    <div class="mx-auto max-w-full px-4">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <NuxtLink
                to="/"
                class="nav-link"
              >
                Projects
              </NuxtLink>
              <NuxtLink
                v-if="entitlements.analyticsPanel"
                to="/analytics"
                class="nav-link"
              >
                Analytics
              </NuxtLink>
            </div>
          </div>
        </div>
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <!-- Profile dropdown -->
            <div class="ml-4 flex items-center md:ml-6 nav-caption">
              Subscription clicks left: {{ entitlements.subscriptionButtonClicks }}
            </div>
            <div class="ml-4 flex items-center md:ml-6 nav-caption">
              Clicks left this minute: {{ entitlements.buttonClicksPerMinute }}
            </div>
            <NuxtLink to="/subscription" class="nav-link" aria-current="undefined">
              Current plan: {{ currentPlanName }}
            </NuxtLink>
            <Menu as="div" class="relative ml-3">
              <div>
                <MenuButton class="user-btn">
                  <span class="sr-only">Open user menu</span>
                  <img class="h-8 w-8 rounded-full" :src="currentUser.imageUrl" alt="">
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
                  <div class="px-1 py-1 ">
                    <MenuItem>
                      <span class="block px-4 py-2 text-sm text-gray-700">Signed in as <b>{{ currentUser.name }}</b></span>
                    </MenuItem>
                  </div>
                  <div class="px-1 py-1 ">
                    <MenuItem v-slot="{ active }">
                      <a href="#" class="block px-4 py-2 text-sm text-gray-700" :class="[active ? 'bg-gray-100' : '']">Log out</a>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  </Disclosure>
</template>

<style lang="postcss">
.nav-caption {
  @apply text-gray-300 rounded-md px-3 py-2 text-sm font-medium;
}

.nav-link {
  @apply text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium;
}

.user-btn {
  @apply flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800;
}
</style>
