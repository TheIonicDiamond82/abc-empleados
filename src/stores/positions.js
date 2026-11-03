import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { positionService } from '@/services/positionService'

export const usePositionStore = defineStore('positions', () => {
  const items = ref([])
  const options = ref([])
  const totalItems = ref(0)
  const totalPages = ref(1)
  const loading = ref(false)
  const saving = ref(false)
  const query = reactive({
    search: '',
    departmentId: '',
    isActive: '',
    page: 1,
    pageSize: 8,
    sortBy: 'name',
    sortDir: 'asc',
  })

  async function fetchList() {
    loading.value = true
    try {
      const result = await positionService.list(query)
      items.value = result.items
      totalItems.value = result.totalItems
      totalPages.value = result.totalPages
    } finally {
      loading.value = false
    }
  }

  async function fetchOptions(departmentId) {
    const result = await positionService.list({
      page: 1,
      pageSize: 100,
      sortBy: 'name',
      sortDir: 'asc',
      departmentId: departmentId || '',
    })
    options.value = result.items
    return options.value
  }

  function setQuery(patch) {
    Object.assign(query, patch)
  }

  async function create(payload) {
    saving.value = true
    try {
      const created = await positionService.create(payload)
      await fetchList()
      return created
    } finally {
      saving.value = false
    }
  }

  async function update(id, payload) {
    saving.value = true
    try {
      const updated = await positionService.update(id, payload)
      await fetchList()
      return updated
    } finally {
      saving.value = false
    }
  }

  async function remove(id) {
    saving.value = true
    try {
      await positionService.remove(id)
      if (items.value.length === 1 && query.page > 1) {
        query.page -= 1
      }
      await fetchList()
    } finally {
      saving.value = false
    }
  }

  return {
    items,
    options,
    totalItems,
    totalPages,
    loading,
    saving,
    query,
    fetchList,
    fetchOptions,
    setQuery,
    create,
    update,
    remove,
  }
})
