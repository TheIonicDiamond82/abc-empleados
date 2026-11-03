<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import '@/components/charts/chartSetup'
import { formatMonthLabel } from '@/utils/date'

const props = defineProps({
  series: { type: Array, default: () => [] },
})

const chartData = computed(() => ({
  labels: props.series.map((item) => formatMonthLabel(item.month)),
  datasets: [
    {
      label: 'Altas',
      data: props.series.map((item) => item.hires),
      backgroundColor: '#0f766e',
    },
    {
      label: 'Cambios',
      data: props.series.map((item) => item.changes),
      backgroundColor: '#334155',
    },
    {
      label: 'Bajas',
      data: props.series.map((item) => item.terminations),
      backgroundColor: '#94a3b8',
    },
  ],
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
  },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, ticks: { precision: 0 } },
  },
}
</script>

<template>
  <Bar :data="chartData" :options="options" />
</template>
