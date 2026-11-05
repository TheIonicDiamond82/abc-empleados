import { API_PATHS } from '@/constants/apiPaths'
import httpClient from '@/services/httpClient'

export const dashboardService = {
  async getSummary() {
    const response = await httpClient.get(API_PATHS.dashboardSummary || '/api/dashboard/summary')
    return response.data
  }
}