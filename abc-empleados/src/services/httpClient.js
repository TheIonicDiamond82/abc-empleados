import axios from 'axios'
import { env } from '@/config/env'
import { attachMockAdapter } from '@/mocks/httpAdapter'

const httpClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
})

if (env.useMocks) {
  attachMockAdapter(httpClient)
}

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error.response?.data?.detail
    error.userMessage = detail || 'No se pudo completar la operación. Intente de nuevo.'
    return Promise.reject(error)
  },
)

export default httpClient
