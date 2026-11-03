import { API_PATHS } from '@/constants/apiPaths'
import httpClient from '@/services/httpClient'

export const dashboardService = {
  getSummary() {
    return httpClient.get(API_PATHS.dashboardSummary).then((response) => response.data)
  },
}
