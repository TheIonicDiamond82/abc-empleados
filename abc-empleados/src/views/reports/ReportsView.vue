<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Download, FileSpreadsheet } from 'lucide-vue-next'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppDataTable from '@/components/ui/AppDataTable.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import StatCard from '@/components/ui/StatCard.vue'
import { useDebouncedWatch } from '@/composables/useDebouncedWatch'
import { useListQuery } from '@/composables/useListQuery'
import { ACTIVITY_ACTION_OPTIONS, ENTITY_TYPE_OPTIONS } from '@/constants/catalogs'
import { useReportStore } from '@/stores/reports'
import { useUiStore } from '@/stores/ui'
import { formatDateTime } from '@/utils/date'
import { ACTION_LABELS, ENTITY_LABELS, exportActivityCsv, exportActivityPdf } from '@/utils/exportActivity'

const reportStore = useReportStore()
const uiStore = useUiStore()
const { items, loading, query, summary, totalItems, totalPages } = storeToRefs(reportStore)
const searchInput = ref('')
const exporting = ref(false)

const columns = [
  { key: 'occurredAt', label: 'Fecha', sortable: true },
  { key: 'action', label: 'Movimiento', sortable: true },
  { key: 'entityType', label: 'Entidad', sortable: true },
  { key: 'description', label: 'Descripción' },
  { key: 'actor', label: 'Actor' },
]

const { toggleSort, changePage } = useListQuery({
  query: reportStore.query,
  fetchList: reportStore.fetchList,
})

useDebouncedWatch(searchInput, (value) => {
  reportStore.setQuery({ search: value, page: 1 })
  reportStore.fetchList()
})

onMounted(async () => {
  try {
    await reportStore.fetchList()
  } catch (error) {
    uiStore.notify({ title: 'No se pudo cargar el reporte', message: error.userMessage, type: 'error' })
  }
})

function actionTone(action) {
  if (action === 'create') return 'success'
  if (action === 'delete') return 'danger'
  return 'neutral'
}

function onFilterChange() {
  reportStore.setQuery({ page: 1 })
  reportStore.fetchList()
}

async function exportCsv() {
  exporting.value = true
  try {
    const rows = await reportStore.fetchAllMatching()
    exportActivityCsv(rows)
  } catch (error) {
    uiStore.notify({ title: 'No se pudo exportar CSV', message: error.userMessage, type: 'error' })
  } finally {
    exporting.value = false
  }
}

async function exportPdf() {
  exporting.value = true
  try {
    const rows = await reportStore.fetchAllMatching()
    exportActivityPdf(rows, summary.value)
  } catch (error) {
    uiStore.notify({ title: 'No se pudo exportar PDF', message: error.userMessage, type: 'error' })
  } finally {
    exporting.value = false
  }
}
</script>

<template>
  <section class="space-y-4">
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Altas" :value="summary.hires" hint="Creaciones en el filtro actual" />
      <StatCard label="Cambios" :value="summary.changes" hint="Modificaciones en el filtro actual" />
      <StatCard label="Bajas" :value="summary.terminations" hint="Eliminaciones en el filtro actual" />
      <StatCard label="Eventos" :value="summary.total" hint="Total de actividad coincidente" />
    </div>

    <div class="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
      <div class="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label class="block space-y-1.5">
          <span class="text-sm font-medium text-ink-700">Búsqueda</span>
          <input
            v-model="searchInput"
            class="w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent"
            placeholder="Descripción o actor"
          />
        </label>
        <label class="block space-y-1.5">
          <span class="text-sm font-medium text-ink-700">Movimiento</span>
          <select
            v-model="query.action"
            class="w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent"
            @change="onFilterChange"
          >
            <option value="">Todos</option>
            <option v-for="option in ACTIVITY_ACTION_OPTIONS" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>
        <label class="block space-y-1.5">
          <span class="text-sm font-medium text-ink-700">Entidad</span>
          <select
            v-model="query.entityType"
            class="w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent"
            @change="onFilterChange"
          >
            <option value="">Todas</option>
            <option v-for="option in ENTITY_TYPE_OPTIONS" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>
        <label class="block space-y-1.5">
          <span class="text-sm font-medium text-ink-700">Desde</span>
          <input
            v-model="query.from"
            type="date"
            class="w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent"
            @change="onFilterChange"
          />
        </label>
        <label class="block space-y-1.5">
          <span class="text-sm font-medium text-ink-700">Hasta</span>
          <input
            v-model="query.to"
            type="date"
            class="w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent"
            @change="onFilterChange"
          />
        </label>
      </div>
      <div class="flex gap-2">
        <AppButton variant="secondary" :disabled="exporting" @click="exportCsv">
          <FileSpreadsheet class="size-4" />
          CSV
        </AppButton>
        <AppButton :disabled="exporting" @click="exportPdf">
          <Download class="size-4" />
          PDF
        </AppButton>
      </div>
    </div>

    <AppDataTable
      :columns="columns"
      :rows="items"
      :loading="loading"
      :sort-by="query.sortBy"
      :sort-dir="query.sortDir"
      empty-title="No hay actividad para el periodo seleccionado"
      @sort="toggleSort"
    >
      <template #occurredAt="{ row }">{{ formatDateTime(row.occurredAt) }}</template>
      <template #action="{ row }">
        <AppBadge :tone="actionTone(row.action)">{{ ACTION_LABELS[row.action] }}</AppBadge>
      </template>
      <template #entityType="{ row }">{{ ENTITY_LABELS[row.entityType] }}</template>
      <template #footer>
        <AppPagination :page="query.page" :total-pages="totalPages" :total-items="totalItems" @change="changePage" />
      </template>
    </AppDataTable>
  </section>
</template>
