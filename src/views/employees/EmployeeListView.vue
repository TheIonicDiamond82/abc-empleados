<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Pencil, Plus, Trash2 } from 'lucide-vue-next'
import EmployeeFormModal from '@/components/employees/EmployeeFormModal.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppDataTable from '@/components/ui/AppDataTable.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import { useDebouncedWatch } from '@/composables/useDebouncedWatch'
import { useListQuery } from '@/composables/useListQuery'
import { EMPLOYEE_STATUS_OPTIONS, statusLabel } from '@/constants/catalogs'
import { useDepartmentStore } from '@/stores/departments'
import { useEmployeeStore } from '@/stores/employees'
import { usePositionStore } from '@/stores/positions'
import { useUiStore } from '@/stores/ui'
import { formatCurrency, fullName } from '@/utils/format'

const employeeStore = useEmployeeStore()
const departmentStore = useDepartmentStore()
const positionStore = usePositionStore()
const uiStore = useUiStore()

const { items, loading, saving, query, totalItems, totalPages } = storeToRefs(employeeStore)
const searchInput = ref('')
const selected = ref(null)
const modalOpen = ref(false)

const columns = [
  { key: 'employeeNumber', label: 'Folio', sortable: true },
  { key: 'name', label: 'Empleado', sortable: true },
  { key: 'departmentName', label: 'Departamento', sortable: true },
  { key: 'positionName', label: 'Puesto' },
  { key: 'status', label: 'Estatus', sortable: true },
  { key: 'salary', label: 'Salario', sortable: true },
  { key: 'actions', label: '' },
]

const { toggleSort, changePage } = useListQuery({
  query: employeeStore.query,
  searchRef: ref(employeeStore.query.search),
  fetchList: employeeStore.fetchList,
})

useDebouncedWatch(searchInput, (value) => {
  employeeStore.setQuery({ search: value, page: 1 })
  employeeStore.fetchList()
})

onMounted(async () => {
  searchInput.value = employeeStore.query.search
  try {
    await Promise.all([
      employeeStore.fetchList(),
      departmentStore.fetchOptions(),
      positionStore.fetchOptions(),
    ])
  } catch (error) {
    uiStore.notify({ title: 'No se pudieron cargar los empleados', message: error.userMessage, type: 'error' })
  }
})

function statusTone(status) {
  if (status === 'active') return 'success'
  if (status === 'inactive') return 'warning'
  return 'danger'
}

function openCreate() {
  selected.value = null
  modalOpen.value = true
}

function openEdit(employee) {
  selected.value = employee
  modalOpen.value = true
}

async function onDepartmentChange(departmentId) {
  await positionStore.fetchOptions(departmentId)
}

async function saveEmployee(payload) {
  try {
    if (selected.value) {
      await employeeStore.update(selected.value.id, payload)
      uiStore.notify({ title: 'Empleado actualizado' })
    } else {
      await employeeStore.create(payload)
      uiStore.notify({ title: 'Empleado dado de alta' })
    }
    modalOpen.value = false
  } catch (error) {
    uiStore.notify({ title: 'No se pudo guardar', message: error.userMessage, type: 'error' })
  }
}

async function removeEmployee(employee) {
  const accepted = await uiStore.confirm({
    title: 'Confirmar baja',
    message: `Se eliminará a ${fullName(employee)}. Esta operación quedará registrada en reportes.`,
    confirmLabel: 'Dar de baja',
  })
  if (!accepted) return

  try {
    await employeeStore.remove(employee.id)
    uiStore.notify({ title: 'Empleado dado de baja' })
  } catch (error) {
    uiStore.notify({ title: 'No se pudo eliminar', message: error.userMessage, type: 'error' })
  }
}

function onFilterChange() {
  employeeStore.setQuery({ page: 1 })
  employeeStore.fetchList()
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div class="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <label class="block space-y-1.5">
          <span class="text-sm font-medium text-ink-700">Búsqueda</span>
          <input
            v-model="searchInput"
            class="w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent"
            placeholder="Nombre, correo o folio"
          />
        </label>
        <label class="block space-y-1.5">
          <span class="text-sm font-medium text-ink-700">Estatus</span>
          <select
            v-model="query.status"
            class="w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent"
            @change="onFilterChange"
          >
            <option value="">Todos</option>
            <option v-for="option in EMPLOYEE_STATUS_OPTIONS" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>
        <label class="block space-y-1.5">
          <span class="text-sm font-medium text-ink-700">Departamento</span>
          <select
            v-model="query.departmentId"
            class="w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent"
            @change="onFilterChange"
          >
            <option value="">Todos</option>
            <option v-for="department in departmentStore.options" :key="department.id" :value="department.id">
              {{ department.name }}
            </option>
          </select>
        </label>
        <label class="block space-y-1.5">
          <span class="text-sm font-medium text-ink-700">Puesto</span>
          <select
            v-model="query.positionId"
            class="w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent"
            @change="onFilterChange"
          >
            <option value="">Todos</option>
            <option v-for="position in positionStore.options" :key="position.id" :value="position.id">
              {{ position.name }}
            </option>
          </select>
        </label>
      </div>
      <AppButton @click="openCreate">
        <Plus class="size-4" />
        Nuevo empleado
      </AppButton>
    </div>

    <AppDataTable
      :columns="columns"
      :rows="items"
      :loading="loading"
      :sort-by="query.sortBy"
      :sort-dir="query.sortDir"
      empty-title="No hay empleados para estos filtros"
      @sort="toggleSort"
    >
      <template #employeeNumber="{ row }">
        <span class="font-medium">{{ row.employeeNumber }}</span>
      </template>
      <template #name="{ row }">
        <div>
          <p class="font-medium">{{ fullName(row) }}</p>
          <p class="text-xs text-ink-500">{{ row.email }}</p>
        </div>
      </template>
      <template #status="{ row }">
        <AppBadge :tone="statusTone(row.status)">{{ statusLabel(row.status) }}</AppBadge>
      </template>
      <template #salary="{ row }">{{ formatCurrency(row.salary) }}</template>
      <template #actions="{ row }">
        <div class="flex justify-end gap-1">
          <AppButton variant="ghost" @click="openEdit(row)">
            <Pencil class="size-4" />
          </AppButton>
          <AppButton variant="ghost" @click="removeEmployee(row)">
            <Trash2 class="size-4" />
          </AppButton>
        </div>
      </template>
      <template #footer>
        <AppPagination :page="query.page" :total-pages="totalPages" :total-items="totalItems" @change="changePage" />
      </template>
    </AppDataTable>

    <EmployeeFormModal
      :open="modalOpen"
      :employee="selected"
      :departments="departmentStore.options"
      :positions="positionStore.options"
      :saving="saving"
      @close="modalOpen = false"
      @submit="saveEmployee"
      @department-change="onDepartmentChange"
    />
  </section>
</template>
