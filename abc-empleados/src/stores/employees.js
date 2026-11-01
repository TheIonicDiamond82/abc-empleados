import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { employeeService } from '@/services/employeeService'

export const useEmployeeStore = defineStore('employees', () => {
  const items = ref([])
  const totalItems = ref(0)
  const totalPages = ref(1)
  const loading = ref(false)
  const saving = ref(false)
  const query = reactive({
    search: '',
    status: '',
    departmentId: '',
    positionId: '',
    page: 1,
    pageSize: 8,
    sortBy: 'lastName',
    sortDir: 'asc',
  })

  async function fetchList() {
    loading.value = true
    try {
      const result = await employeeService.list(query)
      items.value = result.items
      totalItems.value = result.totalItems
      totalPages.value = result.totalPages
    } finally {
      loading.value = false
    }
  }

  function setQuery(patch) {
    Object.assign(query, patch)
  }

  async function create(payload) {
    saving.value = true
    try {
      const created = await employeeService.create(payload)
      await fetchList()
      return created
    } finally {
      saving.value = false
    }
  }

  async function update(id, payload) {
    saving.value = true
    try {
      const updated = await employeeService.update(id, payload)
      await fetchList()
      return updated
    } finally {
      saving.value = false
    }
  }

  async function remove(id) {
    saving.value = true
    try {
      await employeeService.remove(id)
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
    totalItems,
    totalPages,
    loading,
    saving,
    query,
    fetchList,
    setQuery,
    create,
    update,
    remove,
  }
})
