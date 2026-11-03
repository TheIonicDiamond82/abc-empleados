import { API_PATHS } from '@/constants/apiPaths'
import httpClient from '@/services/httpClient'
import { compactQuery } from '@/utils/query'

export const employeeService = {
  list(query) {
    return httpClient.get(API_PATHS.employees, { params: compactQuery(query) }).then((response) => response.data)
  },
  getById(id) {
    return httpClient.get(API_PATHS.employeeById(id)).then((response) => response.data)
  },
  create(payload) {
    return httpClient.post(API_PATHS.employees, payload).then((response) => response.data)
  },
  update(id, payload) {
    return httpClient.put(API_PATHS.employeeById(id), payload).then((response) => response.data)
  },
  remove(id) {
    return httpClient.delete(API_PATHS.employeeById(id)).then((response) => response.data)
  },
}
