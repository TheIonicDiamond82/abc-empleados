<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import '@/components/charts/chartSetup'

const props = defineProps({
  series: { type: Array, default: () => [] },
})

const palette = ['#0f766e', '#115e59', '#334155', '#64748b', '#94a3b8', '#cbd5e1']

const chartData = computed(() => ({
  labels: props.series.map((item) => item.name),
  datasets: [
    {
      data: props.series.map((item) => item.total),
      backgroundColor: props.series.map((_, index) => palette[index % palette.length]),
      borderWidth: 0,
    },
  ],
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
  },
  cutout: '62%',
}
</script>

<template>
  <Doughnut :data="chartData" :options="options" />
</template>
