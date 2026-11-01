import { API_PATHS } from '@/constants/apiPaths'
import httpClient from '@/services/httpClient'
import { compactQuery } from '@/utils/query'

export const reportService = {
  listActivity(query) {
    return httpClient
      .get(API_PATHS.reportsActivity, { params: compactQuery(query) })
      .then((response) => response.data)
  },
}
