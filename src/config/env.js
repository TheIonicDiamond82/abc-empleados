//const useMocks = (String(import.meta.env.VITE_USE_MOCKS ?? 'false') === 'false' ) || 'false'
const useMocks = false // Deshabilitar mocks para producción, ya que el backend está disponible
const apiUrl = import.meta.env.VITE_API_URL || 'https://abc-empleados-api-backend.onrender.com/api'

export const env = Object.freeze({
  useMocks,
  apiUrl, 
})
