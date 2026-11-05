import { API_PATHS } from '@/constants/apiPaths'
import httpClient from '@/services/httpClient'
import { compactQuery } from '@/utils/query'

export const reportService = {
  async listActivity(query) {
    const response = await httpClient.get(API_PATHS.activityReports || '/reports/activity', {
      params: compactQuery(query)
    })
    return response.data
  }
}