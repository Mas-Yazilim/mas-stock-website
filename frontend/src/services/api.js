// Prefer Vite-provided env var VITE_API_URL, otherwise default to backend admin default (3002)
const envApi = typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env.VITE_API_URL === 'string'
  ? import.meta.env.VITE_API_URL
  : undefined

const API_BASE_URL = envApi ?? 'http://localhost:5000/api'

/**
 * @typedef {import('../features/products/types').Product} Product
 * @typedef {import('../features/products/types').ProductColor} ProductColor
 */

/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {string} message
 * @property {T[]} [products]
 * @property {T} [product]
 * @property {number} [count]
 */

class ApiService {
  /**
   * @param {string} baseURL
   */
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
  }

  /**
   * @template T
   * @param {string} endpoint
   * @param {RequestInit} [options={}]
   * @returns {Promise<T>}
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  /**
   * @param {Object} [params]
   * @param {string} [params.category]
   * @param {string} [params.brand]
   * @param {string} [params.search]
   * @returns {Promise<ApiResponse<Product>>}
   */
  async getProducts(params) {
    const searchParams = new URLSearchParams()
    
    if (params?.category) searchParams.append('category', params.category)
    if (params?.brand) searchParams.append('brand', params.brand)
    if (params?.search) searchParams.append('search', params.search)

    const queryString = searchParams.toString()
    const endpoint = `/products/public${queryString ? `?${queryString}` : ''}`
    
    return this.request(endpoint)
  }

  /**
   * @param {string} id
   * @returns {Promise<ApiResponse<Product>>}
   */
  async getProduct(id) {
    return this.request(`/products/${id}`)
  }

  /**
   * @returns {Promise<{message: string, brands: string[]}>}
   */
  async getBrands() {
    return this.request('/products/brands/list')
  }

  /**
   * @returns {Promise<{message: string, categories: string[]}>}
   */
  async getCategories() {
    return this.request('/products/categories/list')
  }
}

// Singleton instance
export const apiService = new ApiService()
export default apiService