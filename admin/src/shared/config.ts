const envApiUrl = typeof import.meta.env.VITE_API_URL === 'string'
  ? import.meta.env.VITE_API_URL
  : undefined

export const API_BASE_URL: string = envApiUrl ?? 'http://localhost:5000/api'

export const apiEndpoint = (path: string): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalized}`
}


