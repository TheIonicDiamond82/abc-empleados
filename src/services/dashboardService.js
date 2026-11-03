import { API_PATHS } from '@/constants/apiPaths'
import httpClient from '@/services/httpClient'

export const dashboardService = {
  async getSummary() {
    try {
      // Intenta llamar al endpoint real del dashboard
      const response = await httpClient.get(API_PATHS.dashboardSummary || '/api/dashboard/summary')
      const data = response.data

      // Si el backend devuelve la estructura correcta con totals, la usamos
      if (data && data.totals) {
        return data
      }

      // Si responde pero con otro formato, aplicamos el respaldo de cálculo local
      return await this._calculateFallbackSummary()
    } catch (error) {
      console.warn('Endpoint de dashboard no disponible en el backend, calculando métricas localmente...', error)
      // Si el endpoint no existe en .NET, calculamos las métricas con los demás catálogos
      return await this._calculateFallbackSummary()
    }
  },

  async _calculateFallbackSummary() {
    try {
      const [empRes, deptRes, posRes] = await Promise.all([
        httpClient.get(API_PATHS.employees, { params: { pageSize: 1000 } }).catch(() => ({ data: [] })),
        httpClient.get(API_PATHS.departments, { params: { pageSize: 1000 } }).catch(() => ({ data: [] })),
        httpClient.get(API_PATHS.positions, { params: { pageSize: 1000 } }).catch(() => ({ data: [] }))
      ])

      const employees = Array.isArray(empRes.data) ? empRes.data : (empRes.data?.items || [])
      const departments = Array.isArray(deptRes.data) ? deptRes.data : (deptRes.data?.items || [])
      const positions = Array.isArray(posRes.data) ? posRes.data : (posRes.data?.items || [])

      // Contar activos (soporta status como número 1 o string 'active' o booleano)
      const activeEmployees = employees.filter(e => 
        e.status === 1 || e.status === 'active' || e.isActive === true
      ).length

      // Calcular totales por departamento para las gráficas del dashboard
      const byDepartment = departments.map(dept => {
        const total = employees.filter(e => e.departmentId === dept.id).length
        return {
          departmentId: dept.id,
          name: dept.name,
          total
        }
      })

      return {
        totals: {
          employees: employees.length,
          activeEmployees,
          departments: departments.length,
          positions: positions.length,
          hiresThisMonth: 0,
          terminationsThisMonth: 0
        },
        byDepartment,
        activityByMonth: []
      }
    } catch (fallbackError) {
      console.error('Error generando fallback del dashboard:', fallbackError)
      return {
        totals: { employees: 0, activeEmployees: 0, departments: 0, positions: 0, hiresThisMonth: 0, terminationsThisMonth: 0 },
        byDepartment: [],
        activityByMonth: []
      }
    }
  }
}