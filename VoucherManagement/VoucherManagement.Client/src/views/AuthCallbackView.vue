<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const router = useRouter()

onMounted(async () => {
  await auth.handleCallback()
  router.push('/')
})
</script>

<template>
  Login wird verarbeitet...
</template>