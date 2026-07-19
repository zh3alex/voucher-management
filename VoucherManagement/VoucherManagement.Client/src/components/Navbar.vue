<template>
  <nav class="border-b px-4 py-2">
    <div class="max-w-7xl mx-auto flex justify-between items-center">

      <!-- Logo -->
      <div 
        class="flex space-x-2" 
        @click="$router.push('/')"
        style="cursor: pointer;"
      >
        <img :src="logoUrl" alt="Logo" class="w-18" />
        <span class="text-2xl pl-2">
          Gutschein-Management
        </span>
      </div>

      <!-- Navigation Menu -->
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>

            <Button
              v-if="!auth.isAuthenticated"
              @click="handleLogin"
              variant="ghost"
            >
              Login
            </Button>

            <Button
              v-else
              @click="handleLogout"
              variant="ghost"
            >
              Logout
            </Button>

          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

    </div>
  </nav>
</template>
<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

import Button from "./ui/button/Button.vue"
import { useAuthStore } from "@/stores/authStore"

const auth = useAuthStore()

const logoUrl = `${import.meta.env.VITE_API_URL}/branding/logo.png`

function handleLogin() {
  auth.login()
}

function handleLogout() {
  auth.logout()
}
</script>