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
    try {
      saving.value = true;

      // Si no trae un employeeNumber, lo generamos automáticamente en el front
      if (!payload.employeeNumber) {
        // Asegurar que tenemos la lista más reciente para calcular el consecutivo
        await fetchList(); 
        payload.employeeNumber = generateNextEmployeeNumber(items.value);
      }

      const newEmployee = await employeeService.create(payload);
      items.value.unshift(newEmployee);
      totalItems.value += 1;
      return newEmployee;
    } catch (error) {
      throw error;
    } finally {
      saving.value = false;
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

  // Función para calcular el siguiente número de empleado
function generateNextEmployeeNumber(existingEmployees) {
  if (!existingEmployees || existingEmployees.length === 0) {
    return 'EMP-000001';
  }

  // Extraer los números de los folios existentes (ej: "EMP-000004" -> 4)
  const numbers = existingEmployees.map(emp => {
    const match = emp.employeeNumber?.match(/EMP-(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  });

  const maxNum = Math.max(...numbers, 0);
  const nextNum = maxNum + 1;

  // Formatear a 6 dígitos con ceros a la izquierda
  return `EMP-${String(nextNum).padStart(6, '0')}`;
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


