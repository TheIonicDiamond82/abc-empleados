/**
 * Contratos esperados de la API REST (C#/.NET).
 * Las rutas son relativas a VITE_API_URL (que ya incluye /api).
 * No duplicar estas rutas en vistas ni componentes.
 */
export const API_PATHS = Object.freeze({
  employees: '/employees',
  employeeById: (id) => `/employees/${id}`,
  employeeStatus: (id) => `/employees/${id}/status`,
  departments: '/departments',
  departmentById: (id) => `/departments/${id}`,
  departmentStatus: (id) => `/departments/${id}/status`,
  positions: '/positions',
  positionById: (id) => `/positions/${id}`,
  positionStatus: (id) => `/positions/${id}/status`,
  dashboardSummary: '/dashboard/summary',
  reportsActivity: '/reports/activity',
})
