import { defineStore } from 'pinia'
import { oidcClient } from '@/lib/oidcClient'

interface UserInfo {
  name?: string
  email?: string
  permissions?: string[]
  groups?: string[]
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as UserInfo | null,
    token: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,

    canManageVouchers: (state) =>
      state.user?.permissions?.includes('manage:vouchers') ?? false,
  },

  actions: {

    async login() {
      console.log(import.meta.env.VITE_AUTHENTIK_AUTHORITY)
      await oidcClient.signinRedirect()
    },

    async handleCallback() {
      const user = await oidcClient.signinRedirectCallback()

      this.token = user.access_token

      this.user = {
        name: user.profile.name as string,
        email: user.profile.email as string,
        permissions: user.profile.permissions as string[] ?? [],
        groups: user.profile.groups as string[] ?? []
      }

      localStorage.setItem('token', this.token)
    },


    async logout() {
      this.user = null
      this.token = null

      localStorage.removeItem('token')

      await oidcClient.signoutRedirect()
    },


    async loadUser() {
      const user = await oidcClient.getUser()

      if (!user) {
        return
      }

      this.token = user.access_token

      this.user = {
        name: user.profile.name as string,
        email: user.profile.email as string,
        permissions: user.profile.permissions as string[] ?? [],
        groups: user.profile.groups as string[] ?? []
      }
    }
  }
})