import { defineStore } from 'pinia'

import type { User } from '@/models/user'

export interface UserState {
  currentUser?: User
}

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: {
        id: '',
        name: 'Darth Vader',
        email: 'vader@empire.gov',
        imageUrl: 'https://planship-samples.s3.us-west-2.amazonaws.com/assets/pngaaa.com-3028172.png',
      },
  } as UserState),
  getters: {
  },
  actions: {
    setUserId(id: string) {
      this.currentUser.id = id
    },
  },
  persist: true,
})
