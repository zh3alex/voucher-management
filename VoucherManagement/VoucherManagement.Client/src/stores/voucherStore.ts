import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/api'
import type { Voucher } from '@/types/voucher'
import type { PagedResult } from '@/types/pagedResult'

export const useVoucherStore = defineStore('vouchers', () => {
  // state
  const vouchers = ref<Voucher[]>([])
  const isLoading = ref(false)

  // pagination metadata
  const pageNumber = ref(1)
  const pageSize = ref(20)
  const totalCount = ref(0)
  const totalPages = ref(0)

  // getters
  const getAll = computed(() => vouchers.value)

  const getById = (id: number) =>
    vouchers.value.find(n => n.id === id)

  // actions
  async function fetchPage(page = 1, size = 20) {
    isLoading.value = true
    try {
      // API Call with query params
      const res = await api.get<PagedResult<Voucher>>('/vouchers', {
        params: { pageNumber: page, pageSize: size }
      })

      // backend returns camelCase JSON (items, totalCount...)
      vouchers.value = res.data.items
      pageNumber.value = res.data.pageNumber
      pageSize.value = res.data.pageSize
      totalCount.value = res.data.totalCount
      totalPages.value = res.data.totalPages
    } finally {
      isLoading.value = false
    }
  }

  // kept for backward compatibility: fetchAll loads first page
  async function fetchAll() {
    return fetchPage(1, 20)
  }

  async function create() {
    isLoading.value = true
    try {
      const res = await api.post<Voucher>('/vouchers')

      // Backend liefert den neu erstellten Voucher zurück
      // Insert into current page list
      vouchers.value.unshift(res.data)

      totalCount.value += 1

      return res.data
    } finally {
      isLoading.value = false
    }
  }

  async function update(id: number, patch: Partial<Omit<Voucher, 'id'>>) {
    isLoading.value = true
    try {
      await api.put(`/vouchers/${id}`, patch)

      const index = vouchers.value.findIndex(v => v.id === id)
      if (index === -1) return null

      vouchers.value[index] = {
        ...vouchers.value[index],
        ...patch,
        updatedAt: new Date().toISOString()
      } as Voucher

      return vouchers.value[index]
    } finally {
      isLoading.value = false
    }
  }

  async function remove(id: number) {
    isLoading.value = true

    try {
      await api.delete(`/vouchers/${id}`)

      const index = vouchers.value.findIndex(v => v.id === id)

      if (index !== -1) {
        vouchers.value.splice(index, 1)
        totalCount.value = Math.max(0, totalCount.value - 1)
      }

      return true
    } finally {
      isLoading.value = false
    }
  }

  async function openPdf(id: number) {
    isLoading.value = true
    try {
      const res = await api.get(`/vouchers/${id}/pdf`, {
        responseType: 'blob'
      })

      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)

      window.open(url, '_blank')

      // optional: später freigeben
      // setTimeout(() => URL.revokeObjectURL(url), 1000)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // state
    vouchers,
    isLoading,
    pageNumber,
    pageSize,
    totalCount,
    totalPages,

    // getters
    getAll,
    getById,

    // actions
    fetchAll,
    fetchPage,
    create,
    update,
    remove,
    openPdf
  }
})
