import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { reportService } from '@/services/reportService'

export const useReportStore = defineStore('reports', () => {
  const items = ref([])
  const summary = ref({ hires: 0, changes: 0, terminations: 0, total: 0 })
  const totalItems = ref(0)
  const totalPages = ref(1)
  const loading = ref(false)
  const query = reactive({
    search: '',
    action: '',
    entityType: '',
    from: '',
    to: '',
    page: 1,
    pageSize: 10,
    sortBy: 'occurredAt',
    sortDir: 'desc',
  })

  async function fetchList() {
    loading.value = true
    try {
      const result = await reportService.listActivity(query)
      items.value = result.items
      summary.value = result.summary
      totalItems.value = result.totalItems
      totalPages.value = result.totalPages
    } finally {
      loading.value = false
    }
  }

  async function fetchAllMatching() {
    const result = await reportService.listActivity({
      ...query,
      page: 1,
      pageSize: 1000,
    })
    return result.items
  }

  function setQuery(patch) {
    Object.assign(query, patch)
  }

  return {
    items,
    summary,
    totalItems,
    totalPages,
    loading,
    query,
    fetchList,
    fetchAllMatching,
    setQuery,
  }
})
