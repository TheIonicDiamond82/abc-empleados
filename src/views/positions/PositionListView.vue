<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Pencil, Plus, Trash2 } from 'lucide-vue-next'
import PositionFormModal from '@/components/positions/PositionFormModal.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppDataTable from '@/components/ui/AppDataTable.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import { useDebouncedWatch } from '@/composables/useDebouncedWatch'
import { useListQuery } from '@/composables/useListQuery'
import { useDepartmentStore } from '@/stores/departments'
import { usePositionStore } from '@/stores/positions'
import { useUiStore } from '@/stores/ui'
import { formatCurrency } from '@/utils/format'

const positionStore = usePositionStore()
const departmentStore = useDepartmentStore()
const uiStore = useUiStore()
const { items, loading, saving, query, totalItems, totalPages } = storeToRefs(positionStore)
const searchInput = ref('')
const selected = ref(null)
const modalOpen = ref(false)

const columns = [
  { key: 'code', label: 'Código', sortable: true },
  { key: 'name', label: 'Puesto', sortable: true },
  { key: 'departmentName', label: 'Departamento', sortable: true },
  { key: 'level', label: 'Nivel', sortable: true },
  { key: 'range', label: 'Rango salarial' },
  { key: 'isActive', label: 'Estatus' },
  { key: 'actions', label: '' },
]

const { toggleSort, changePage } = useListQuery({
  query: positionStore.query,
  fetchList: positionStore.fetchList,
})

useDebouncedWatch(searchInput, (value) => {
  positionStore.setQuery({ search: value, page: 1 })
  positionStore.fetchList()
})

onMounted(async () => {
  try {
    await Promise.all([positionStore.fetchList(), departmentStore.fetchOptions()])
  } catch (error) {
    uiStore.notify({ title: 'No se pudieron cargar los puestos', message: error.userMessage, type: 'error' })
  }
})

function openCreate() {
  selected.value = null
  modalOpen.value = true
}

function openEdit(position) {
  selected.value = position
  modalOpen.value = true
}

async function savePosition(payload) {
  try {
    if (selected.value) {
      await positionStore.update(selected.value.id, payload)
      uiStore.notify({ title: 'Puesto actualizado' })
    } else {
      await positionStore.create(payload)
      uiStore.notify({ title: 'Puesto creado' })
    }
    modalOpen.value = false
  } catch (error) {
    uiStore.notify({ title: 'No se pudo guardar', message: error.userMessage, type: 'error' })
  }
}

async function removePosition(position) {
  const accepted = await uiStore.confirm({
    title: 'Eliminar puesto',
    message: `Se eliminará ${position.name}. Si hay empleados asignados, la API rechazará la operación.`,
    confirmLabel: 'Eliminar',
  })
  if (!accepted) return

  try {
    await positionStore.remove(position.id)
    uiStore.notify({ title: 'Puesto eliminado' })
  } catch (error) {
    uiStore.notify({ title: 'No se pudo eliminar', message: error.userMessage, type: 'error' })
  }
}

function onFilterChange() {
  positionStore.setQuery({ page: 1 })
  positionStore.fetchList()
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div class="grid flex-1 gap-3 sm:grid-cols-3">
        <label class="block space-y-1.5">
          <span class="text-sm font-medium text-ink-700">Búsqueda</span>
          <input
            v-model="searchInput"
            class="w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent"
            placeholder="Nombre, código o nivel"
          />
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
        Nuevo puesto
      </AppButton>
    </div>

    <AppDataTable
      :columns="columns"
      :rows="items"
      :loading="loading"
      :sort-by="query.sortBy"
      :sort-dir="query.sortDir"
      empty-title="No hay puestos para estos filtros"
      @sort="toggleSort"
    >
      <template #range="{ row }">
        {{ formatCurrency(row.minSalary) }} — {{ formatCurrency(row.maxSalary) }}
      </template>
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
          <AppButton variant="ghost" @click="removePosition(row)">
            <Trash2 class="size-4" />
          </AppButton>
        </div>
      </template>
      <template #footer>
        <AppPagination :page="query.page" :total-pages="totalPages" :total-items="totalItems" @change="changePage" />
      </template>
    </AppDataTable>

    <PositionFormModal
      :open="modalOpen"
      :position="selected"
      :departments="departmentStore.options"
      :saving="saving"
      @close="modalOpen = false"
      @submit="savePosition"
    />
  </section>
</template>
