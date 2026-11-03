import { API_PATHS } from '@/constants/apiPaths'
import httpClient from '@/services/httpClient'
import { compactQuery } from '@/utils/query'

export const positionService = {
list(query) {
    return httpClient.get(API_PATHS.positions, { params: compactQuery(query) }).then((response) => {
      const data = response.data

      // Si el backend devuelve un arreglo plano [...], lo adaptamos al contrato paginado
      if (Array.isArray(data)) {
        return {
          items: data,
          page: query?.page || 1,
          pageSize: query?.pageSize || data.length,
          totalItems: data.length,
          totalPages: 1
        }
      }

      // Si ya viene con estructura paginada, lo retorna tal cual
      return data
    })
  },
  getById(id) {
    return httpClient.get(API_PATHS.positionById(id)).then((response) => response.data)
  },
  create(payload) {
    return httpClient.post(API_PATHS.positions, payload).then((response) => response.data)
  },
  update(id, payload) {
    return httpClient.put(API_PATHS.positionById(id), payload).then((response) => response.data)
  },
  remove(id) {
    return httpClient.delete(API_PATHS.positionById(id)).then((response) => response.data)
  },
}
