<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'

const props = defineProps<{ page: number; totalPages: number }>()
const emit = defineEmits<{
  (e: 'change', page: number): void
}>()

const pagesToShow = computed(() => {
  const pages: number[] = []
  const total = Math.max(1, props.totalPages || 1)
  const current = Math.max(1, props.page || 1)
  const start = Math.max(1, current - 2)
  const end = Math.min(total, current + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

function go(p: number) {
  if (p === props.page) return
  emit('change', p)
}

function prev() {
  go(Math.max(1, props.page - 1))
}

function next() {
  go(Math.min(props.totalPages, props.page + 1))
}
</script>

<template>
  <div class="flex items-center justify-between py-4">
    <div class="text-sm text-muted-foreground">Seite {{ props.page }} von {{ props.totalPages }}</div>
    <div class="flex items-center space-x-2">
      <Button variant="outline" :disabled="props.page<=1" @click="prev">Vorherige</Button>
      <Button v-for="p in pagesToShow" :key="p" type="button" :class="{ 'font-medium': p===props.page }" @click="go(p)">{{ p }}</Button>
      <Button variant="outline" :disabled="props.page>=props.totalPages" @click="next">Nächste</Button>
    </div>
  </div>
</template>
