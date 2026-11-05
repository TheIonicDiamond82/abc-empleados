import { API_PATHS } from '@/constants/apiPaths'
import {EMPLOYEE_STATUS_OPTIONS} from '@/constants/catalogs'
import httpClient from '@/services/httpClient'
import { compactQuery } from '@/utils/query'

const baja= EMPLOYEE_STATUS_OPTIONS.find(option => option.value === 'terminated')?.value || 'terminated'

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
    return httpClient.patch(API_PATHS.employeeStatus(id), 'terminated')
      .then((response) => response.data)},
}
