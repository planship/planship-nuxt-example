import { defineStore } from 'pinia'

import { User } from '@/models/user'

export type UserState = {
  currentUser: User;
};


export const useUserStore = defineStore('user', {
  state: () => ({ 
    currentUser: {
      name: 'Darth Vader',
      slug: 'darth-vader',
      id: 'darth-vader',
      email: 'vader@empire.gov',
      imageUrl: 'https://planship-samples.s3.us-west-2.amazonaws.com/assets/pngaaa.com-3028172.png'
    },
  } as UserState),
  getters: {
  },
  actions: {
  },
  persist: true,
})