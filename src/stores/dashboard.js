import { ref } from 'vue'
import { defineStore } from 'pinia'
import { dashboardService } from '@/services/dashboardService'

export const useDashboardStore = defineStore('dashboard', () => {
  const summary = ref(null)
  const loading = ref(false)

  async function fetchSummary() {
    loading.value = true
    try {
      summary.value = await dashboardService.getSummary()
    } finally {
      loading.value = false
    }
  }

  return { summary, loading, fetchSummary }
})
