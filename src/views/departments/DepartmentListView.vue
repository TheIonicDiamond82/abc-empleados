<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Pencil, Plus, Trash2 } from 'lucide-vue-next'
import DepartmentFormModal from '@/components/departments/DepartmentFormModal.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppDataTable from '@/components/ui/AppDataTable.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import { useDebouncedWatch } from '@/composables/useDebouncedWatch'
import { useListQuery } from '@/composables/useListQuery'
import { useDepartmentStore } from '@/stores/departments'
import { useUiStore } from '@/stores/ui'

const departmentStore = useDepartmentStore()
const uiStore = useUiStore()
const { items, loading, saving, query, totalItems, totalPages } = storeToRefs(departmentStore)
const searchInput = ref('')
const selected = ref(null)
const modalOpen = ref(false)

const columns = [
  { key: 'code', label: 'Código', sortable: true },
  { key: 'name', label: 'Nombre', sortable: true },
  { key: 'employeeCount', label: 'Empleados', sortable: true },
  { key: 'positionCount', label: 'Puestos' },
  { key: 'isActive', label: 'Estatus', sortable: true },
  { key: 'actions', label: '' },
]

const { toggleSort, changePage } = useListQuery({
  query: departmentStore.query,
  fetchList: departmentStore.fetchList,
})

useDebouncedWatch(searchInput, (value) => {
  departmentStore.setQuery({ search: value, page: 1 })
  departmentStore.fetchList()
})

onMounted(async () => {
  try {
    await departmentStore.fetchList()
  } catch (error) {
    uiStore.notify({ title: 'No se pudieron cargar los departamentos', message: error.userMessage, type: 'error' })
  }
})

function openCreate() {
  selected.value = null
  modalOpen.value = true
}

function openEdit(department) {
  selected.value = department
  modalOpen.value = true
}

async function saveDepartment(payload) {
  try {
    if (selected.value) {
      await departmentStore.update(selected.value.id, payload)
      uiStore.notify({ title: 'Departamento actualizado' })
    } else {
      await departmentStore.create(payload)
      uiStore.notify({ title: 'Departamento creado' })
    }
    modalOpen.value = false
  } catch (error) {
    uiStore.notify({ title: 'No se pudo guardar', message: error.userMessage, type: 'error' })
  }
}

async function removeDepartment(department) {
  const accepted = await uiStore.confirm({
    title: 'Eliminar departamento',
    message: `Se eliminará ${department.name}. Si tiene puestos o empleados asociados, la API rechazará la operación.`,
    confirmLabel: 'Eliminar',
  })
  if (!accepted) return

  try {
    await departmentStore.remove(department.id)
    uiStore.notify({ title: 'Departamento eliminado' })
  } catch (error) {
    uiStore.notify({ title: 'No se pudo eliminar', message: error.userMessage, type: 'error' })
  }
}

function onFilterChange() {
  departmentStore.setQuery({ page: 1 })
  departmentStore.fetchList()
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div class="grid flex-1 gap-3 sm:grid-cols-2">
        <label class="block space-y-1.5">
          <span class="text-sm font-medium text-ink-700">Búsqueda</span>
          <input
            v-model="searchInput"
            class="w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent"
            placeholder="Nombre o código"
          />
        </label>
        <label class="block space-y-1.5">
          <span class="text-sm font-medium text-ink-700">Estatus</span>
          <select
            v-model="query.isActive"
            class="w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent"
            @change="onFilterChange"
          >
            <option value="">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </label>
      </div>
      <AppButton @click="openCreate">
        <Plus class="size-4" />
        Nuevo departamento
      </AppButton>
    </div>

    <AppDataTable
      :columns="columns"
      :rows="items"
      :loading="loading"
      :sort-by="query.sortBy"
      :sort-dir="query.sortDir"
      empty-title="No hay departamentos para estos filtros"
      @sort="toggleSort"
    >
      <template #isActive="{ row }">
        <AppBadge :tone="row.isActive ? 'success' : 'neutral'">
          {{ row.isActive ? 'Activo' : 'Inactivo' }}
        </AppBadge>
      </template>
      <template #actions="{ row }">
        <div class="flex justify-end gap-1">
          <AppButton variant="ghost" @click="openEdit(row)">
            <Pencil class="size-4" />
          </AppButton>
          <AppButton variant="ghost" @click="removeDepartment(row)">
            <Trash2 class="size-4" />
          </AppButton>
        </div>
      </template>
      <template #footer>
        <AppPagination :page="query.page" :total-pages="totalPages" :total-items="totalItems" @change="changePage" />
      </template>
    </AppDataTable>

    <DepartmentFormModal
      :open="modalOpen"
      :department="selected"
      :saving="saving"
      @close="modalOpen = false"
      @submit="saveDepartment"
    />
  </section>
</template>
