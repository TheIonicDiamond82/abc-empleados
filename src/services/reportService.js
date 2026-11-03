import { API_PATHS } from '@/constants/apiPaths'
import httpClient from '@/services/httpClient'
import { compactQuery } from '@/utils/query'

export const reportService = {
  async getActivity(query) {
    try {
      const response = await httpClient.get(API_PATHS.activityReports || '/api/reports/activity', {
        params: compactQuery(query)
      })
      const data = response.data

      // Si el backend devuelve un arreglo plano [...], lo adaptamos al contrato paginado
      if (Array.isArray(data)) {
        return {
          items: data,
          page: query?.page || 1,
          pageSize: query?.pageSize || data.length,
          totalItems: data.length,
          totalPages: 1,
          summary: { hires: 0, changes: 0, terminations: 0, total: data.length }
        }
      }

      // Si ya viene con estructura paginada, lo retorna tal cual
      if (data && Array.isArray(data.items)) {
        return data
      }

      // Estructura por defecto en caso de respuesta vacía
      return {
        items: [],
        page: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
        summary: { hires: 0, changes: 0, terminations: 0, total: 0 }
      }
    } catch (error) {
      console.warn('Endpoint de reportes no disponible o sin datos, devolviendo estructura vacía segura.', error)
      return {
        items: [],
        page: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
        summary: { hires: 0, changes: 0, terminations: 0, total: 0 }
      }
    }
  }
}