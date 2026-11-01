<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import ActivityBarChart from '@/components/charts/ActivityBarChart.vue'
import DepartmentDoughnutChart from '@/components/charts/DepartmentDoughnutChart.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import StatCard from '@/components/ui/StatCard.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { useUiStore } from '@/stores/ui'

const dashboardStore = useDashboardStore()
const uiStore = useUiStore()
const { summary, loading } = storeToRefs(dashboardStore)

const totals = computed(() => summary.value?.totals)
const activityByMonth = computed(() => summary.value?.activityByMonth ?? [])
const byDepartment = computed(() => summary.value?.byDepartment ?? [])

onMounted(async () => {
  try {
    await dashboardStore.fetchSummary()
  } catch (error) {
    uiStore.notify({ title: 'No se pudo cargar el dashboard', message: error.userMessage, type: 'error' })
  }
})
</script>

<template>
  <section class="space-y-6">
    <AppSpinner v-if="loading && !summary" />
    <template v-else>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Plantilla total"
          :value="totals?.employees ?? 0"
          :hint="`${totals?.activeEmployees ?? 0} activos`"
        />
        <StatCard
          label="Altas del mes"
          :value="totals?.hiresThisMonth ?? 0"
          hint="Registros de creación en el periodo"
        />
        <StatCard
          label="Bajas del mes"
          :value="totals?.terminationsThisMonth ?? 0"
          hint="Salidas registradas en el periodo"
        />
        <StatCard
          label="Estructura"
          :value="`${totals?.departments ?? 0} / ${totals?.positions ?? 0}`"
          hint="Departamentos y puestos activos"
        />
      </div>

      <div class="grid gap-4 xl:grid-cols-5">
        <article class="rounded-xl border border-ink-200 bg-white p-5 xl:col-span-3">
          <h2 class="text-sm font-medium text-ink-900">Movimientos ABC (6 meses)</h2>
          <div class="mt-4 h-72">
            <ActivityBarChart :series="activityByMonth" />
          </div>
        </article>
        <article class="rounded-xl border border-ink-200 bg-white p-5 xl:col-span-2">
          <h2 class="text-sm font-medium text-ink-900">Distribución por departamento</h2>
          <div class="mt-4 h-72">
            <DepartmentDoughnutChart :series="byDepartment" />
          </div>
        </article>
      </div>
    </template>
  </section>
</template>
