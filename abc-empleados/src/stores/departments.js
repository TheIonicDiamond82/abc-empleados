import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { departmentService } from '@/services/departmentService'

export const useDepartmentStore = defineStore('departments', () => {
  const items = ref([])
  const options = ref([])
  const totalItems = ref(0)
  const totalPages = ref(1)
  const loading = ref(false)
  const saving = ref(false)
  const query = reactive({
    search: '',
    isActive: '',
    page: 1,
    pageSize: 8,
    sortBy: 'name',
    sortDir: 'asc',
  })

  async function fetchList() {
    loading.value = true
    try {
      const result = await departmentService.list(query)
      items.value = result.items
      totalItems.value = result.totalItems
      totalPages.value = result.totalPages
    } finally {
      loading.value = false
    }
  }

  async function fetchOptions() {
    const result = await departmentService.list({ page: 1, pageSize: 100, sortBy: 'name', sortDir: 'asc' })
    options.value = result.items
    return options.value
  }

  function setQuery(patch) {
    Object.assign(query, patch)
  }

  async function create(payload) {
    saving.value = true
    try {
      const created = await departmentService.create(payload)
      await Promise.all([fetchList(), fetchOptions()])
      return created
    } finally {
      saving.value = false
    }
  }

  async function update(id, payload) {
    saving.value = true
    try {
      const updated = await departmentService.update(id, payload)
      await Promise.all([fetchList(), fetchOptions()])
      return updated
    } finally {
      saving.value = false
    }
  }

  async function remove(id) {
    saving.value = true
    try {
      await departmentService.remove(id)
      if (items.value.length === 1 && query.page > 1) {
        query.page -= 1
      }
      await Promise.all([fetchList(), fetchOptions()])
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
