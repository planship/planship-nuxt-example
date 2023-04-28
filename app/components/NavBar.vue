<template>
  <Disclosure  as="nav" class="bg-gray-800" v-slot="{ open }">
    <div class="mx-auto max-w-full px-4">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
        	<div class="hidden md:block">
	          <div class="ml-10 flex items-baseline space-x-4">
	            <a href="/" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Projects</a>
	            <a href="/analytics" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Analytics</a>
	          </div>
	        </div>
        </div>
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <!-- Profile dropdown -->
            <a href="/subscription" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" aria-current="undefined">My Subscription</a>
            <Menu as="div" class="relative ml-3">
              <div>
                <MenuButton class="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span class="sr-only">Open user menu</span>
                  <img class="h-8 w-8 rounded-full" :src="currentUser.imageUrl" alt="" />
                </MenuButton>
              </div>
              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
                	<div class="px-1 py-1 ">
                		<MenuItem >
                    	<span class="block px-4 py-2 text-sm text-gray-700">Signed in as <b>{{ currentUser.name }}</b></span>
                  	</MenuItem>
                  </div>
                  <div class="px-1 py-1 ">
                		<MenuItem v-slot="{ active }">
                    	<a href="#" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Log out</a>
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

<script setup>

import { useProjectsStore } from '@/stores/projects';
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'


import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'


const projectsStore = useProjectsStore()
const { currentUser } = storeToRefs(useUserStore())
const route = useRoute()
if (route.params.project) {
	projectsStore.setCurrentProject(route.params.project)
}
const { currentProject, projects }  = storeToRefs(projectsStore)

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]

function navigateToProject(slug) {
	projectsStore.setCurrentProject(slug)
	navigateTo("/" + slug)
}


</script>