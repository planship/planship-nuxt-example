import { defineStore } from 'pinia'

import { User } from '@/models/user'

export type UserState = {
  currentUser?: User;
};

const vader: User = {
    name: 'Darth Vader',
    email: 'vader@empire.gov',
    imageUrl: 'https://planship-samples.s3.us-west-2.amazonaws.com/assets/pngaaa.com-3028172.png'
  }


export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: vader
  } as UserState),
  getters: {
  },
  actions: {
  },
  persist: true,
})
