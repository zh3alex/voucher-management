<template>
  <div class="max-w-sm mx-auto mt-20 space-y-6">
    <h2 class="text-2xl font-bold text-center">
      Login
    </h2>

    <div v-if="error" class="text-red-600 text-sm">
      {{ error }}
    </div>

    <Button 
      class="w-full" 
      type="button"
      @click="submit"
    >
      Mit Authentik anmelden
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'

const error = ref<string | null>(null)

const auth = useAuthStore()

async function submit(): Promise<void> {
  error.value = null

  try {
    await auth.login()
  } catch {
    error.value = 'Login fehlgeschlagen'
  }
}
</script>