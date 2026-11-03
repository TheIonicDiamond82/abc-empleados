import { API_PATHS } from '@/constants/apiPaths'
import { getDashboardSummary, listActivity } from '@/mocks/resources/analytics'
import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  listDepartments,
  updateDepartment,
} from '@/mocks/resources/departments'
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  listEmployees,
  updateEmployee,
} from '@/mocks/resources/employees'
import {
  createPosition,
  deletePosition,
  getPosition,
  listPositions,
  updatePosition,
} from '@/mocks/resources/positions'

const MOCK_DELAY_MS = 280

export function attachMockAdapter(http) {
  http.interceptors.request.use((config) => {
    config.adapter = async (currentConfig) => {
      await wait(MOCK_DELAY_MS)
      try {
        const result = dispatch(currentConfig)
        return {
          data: result,
          status: currentConfig.method?.toLowerCase() === 'delete' && result == null ? 204 : 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          config: currentConfig,
          request: {},
        }
      } catch (error) {
        return Promise.reject(error)
      }
    }
    return config
  })
}

function dispatch(config) {
  const method = (config.method || 'get').toUpperCase()
  const path = normalizePath(config.url)
  const query = { ...(config.params || {}) }
  const body = parseBody(config.data)

  if (method === 'GET' && path === API_PATHS.employees) return listEmployees(query)
  if (method === 'POST' && path === API_PATHS.employees) return createEmployee(body)
  if (method === 'GET' && matchId(path, 'employees')) return getEmployee(matchId(path, 'employees'))
  if (method === 'PUT' && matchId(path, 'employees')) {
    return updateEmployee(matchId(path, 'employees'), body)
  }
  if (method === 'DELETE' && matchId(path, 'employees')) {
    return deleteEmployee(matchId(path, 'employees'))
  }

  if (method === 'GET' && path === API_PATHS.departments) return listDepartments(query)
  if (method === 'POST' && path === API_PATHS.departments) return createDepartment(body)
  if (method === 'GET' && matchId(path, 'departments')) return getDepartment(matchId(path, 'departments'))
  if (method === 'PUT' && matchId(path, 'departments')) {
    return updateDepartment(matchId(path, 'departments'), body)
  }
  if (method === 'DELETE' && matchId(path, 'departments')) {
    return deleteDepartment(matchId(path, 'departments'))
  }

  if (method === 'GET' && path === API_PATHS.positions) return listPositions(query)
  if (method === 'POST' && path === API_PATHS.positions) return createPosition(body)
  if (method === 'GET' && matchId(path, 'positions')) return getPosition(matchId(path, 'positions'))
  if (method === 'PUT' && matchId(path, 'positions')) {
    return updatePosition(matchId(path, 'positions'), body)
  }
  if (method === 'DELETE' && matchId(path, 'positions')) {
    return deletePosition(matchId(path, 'positions'))
  }

  if (method === 'GET' && path === API_PATHS.dashboardSummary) return getDashboardSummary()
  if (method === 'GET' && path === API_PATHS.reportsActivity) return listActivity(query)

  const error = new Error(`Ruta mock no implementada: ${method} ${path}`)
  error.response = {
    status: 501,
    data: { title: 'Not Implemented', status: 501, detail: error.message },
  }
  throw error
}

function normalizePath(url) {
  const raw = String(url || '')
  const withoutOrigin = raw.replace(/^https?:\/\/[^/]+/i, '')
  const path = withoutOrigin.split('?')[0]
  return path.replace(/\/$/, '') || '/'
}

function matchId(path, resource) {
  const match = path.match(new RegExp(`^/${resource}/(\\d+)$`))
  return match ? match[1] : null
}

function parseBody(data) {
  if (data == null || data === '') return {}
  if (typeof data === 'string') return JSON.parse(data)
  return data
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
