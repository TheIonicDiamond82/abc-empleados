const useMocks = String(import.meta.env.VITE_USE_MOCKS ?? 'true') === 'true'
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5080/api'

export const env = Object.freeze({
  useMocks,
  apiUrl,
})
