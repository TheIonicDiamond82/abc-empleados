/**
 * Contratos esperados de la API REST (C#/.NET).
 * Las rutas son relativas a VITE_API_URL (que ya incluye /api).
 * No duplicar estas rutas en vistas ni componentes.
 */
export const API_PATHS = Object.freeze({
  employees: '/employees',
  employeeById: (id) => `/employees/${id}`,
  departments: '/departments',
  departmentById: (id) => `/departments/${id}`,
  positions: '/positions',
  positionById: (id) => `/positions/${id}`,
  dashboardSummary: '/dashboard/summary',
  reportsActivity: '/reports/activity',
})
