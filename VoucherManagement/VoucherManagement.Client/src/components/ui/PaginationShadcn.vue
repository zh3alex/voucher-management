<script setup lang="ts">
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
const props = defineProps<{ page: number; totalPages: number }>()
const emit = defineEmits<{
  (e: 'change', page: number): void
}>()

function go(p: number) {
  if (p === props.page) return
  emit('change', p)
}

function handleInnerChange(e: any) {
  if (typeof e === 'number') return go(e)
  const p = e?.page ?? e?.value ?? e?.detail ?? null
  if (typeof p === 'number') go(p)
}
</script>

<template>
  <div class="flex flex-col gap-6 py-4">
    <Pagination
      v-slot="{ page }"
      :items-per-page="1"
      :total="props.totalPages"
      :page="props.page"
      @update:page="go"
      @update:modelValue="handleInnerChange"
      @change="handleInnerChange"
      @page-change="handleInnerChange"
    >
      <PaginationContent v-slot="{ items }">
        <PaginationPrevious />
        <template v-for="(item, index) in items" :key="index">
          <PaginationItem
            v-if="item.type === 'page'"
            :value="item.value"
            :is-active="item.value === page"
          >
            {{ item.value }}
          </PaginationItem>
        </template>
        <PaginationEllipsis :index="4" />
        <PaginationNext />
      </PaginationContent>
    </Pagination>
  </div>
</template>
