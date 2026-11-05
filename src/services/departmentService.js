import { API_PATHS } from '@/constants/apiPaths'
import httpClient from '@/services/httpClient'
import { compactQuery } from '@/utils/query'

export const departmentService = {
async list(query) {
    try {
      // 1. Hacemos la petición de departamentos y en paralelo pedimos los listados generales para calcular
      const [deptResponse, empResponse, posResponse] = await Promise.all([
        httpClient.get(API_PATHS.departments, { params: compactQuery(query) }),
        httpClient.get(API_PATHS.employees, { params: { pageSize: 1000 } }).catch(() => ({ data: [] })),
        httpClient.get(API_PATHS.positions, { params: { pageSize: 1000 } }).catch(() => ({ data: [] }))
      ])

      const rawDepts = deptResponse.data
      
      // Normalizamos si el backend devuelve un arreglo plano o un objeto paginado
      const deptsItems = Array.isArray(rawDepts) ? rawDepts : (rawDepts.items || [])
      
      // Extraemos los arreglos de empleados y puestos de forma segura
      const employees = Array.isArray(empResponse.data) ? empResponse.data : (empResponse.data?.items || [])
      const positions = Array.isArray(posResponse.data) ? posResponse.data : (posResponse.data?.items || [])

      // 2. Calculamos los conteos dinámicamente por cada departamento
      const itemsWithCounts = deptsItems.map(dept => {
        const deptId = dept.id
        
        // Contamos cuántos empleados y puestos pertenecen a este departamento
        const employeeCount = employees.filter(e => e.departmentId === deptId).length
        const positionCount = positions.filter(p => p.departmentId === deptId).length

        return {
          ...dept,
          employeeCount: dept.employeeCount ?? employeeCount,
          positionCount: dept.positionCount ?? positionCount
        }
      })

      // 3. Devolvemos la estructura respetando si era paginada o plana
      if (Array.isArray(rawDepts)) {
        return {
          items: itemsWithCounts,
          page: query?.page || 1,
          pageSize: query?.pageSize || itemsWithCounts.length,
          totalItems: itemsWithCounts.length,
          totalPages: 1
        }
      } else {
        return {
          ...rawDepts,
          items: itemsWithCounts
        }
      }
    } catch (error) {
      console.error('Error calculando conteos en departamentos:', error)
      throw error
    }
  },
  getById(id) {
    return httpClient.get(API_PATHS.departmentById(id)).then((response) => response.data)
  },
  create(payload) {
    return httpClient.post(API_PATHS.departments, payload).then((response) => response.data)
  },
  update(id, payload) {
    return httpClient.put(API_PATHS.departmentById(id), payload).then((response) => response.data)
  },
  remove(id) {
    return httpClient.patch(API_PATHS.departmentStatus(id), false)
      .then((response) => response.data)  },
}
