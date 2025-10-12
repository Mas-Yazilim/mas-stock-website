const API_BASE_URL = 'http://localhost:3002/api'

export interface Product {
  _id: string
  name: string
  brand: string
  model: string
  storage: string
  category: string
  colors: ProductColor[]
  cashPrice: number
  visaPrice: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductColor {
  name: string
  hex: string
  available: boolean
}

export interface ApiResponse<T> {
  message: string
  products?: T[]
  product?: T
  count?: number
}

class ApiService {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
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

  // Ürünler API'si
  async getProducts(params?: {
    category?: string
    brand?: string
    search?: string
  }): Promise<ApiResponse<Product>> {
    const searchParams = new URLSearchParams()
    
    if (params?.category) searchParams.append('category', params.category)
    if (params?.brand) searchParams.append('brand', params.brand)
    if (params?.search) searchParams.append('search', params.search)

    const queryString = searchParams.toString()
    const endpoint = `/products/public${queryString ? `?${queryString}` : ''}`
    
    return this.request<ApiResponse<Product>>(endpoint)
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.request<ApiResponse<Product>>(`/products/${id}`)
  }

  async getBrands(): Promise<{ message: string; brands: string[] }> {
    return this.request<{ message: string; brands: string[] }>('/products/brands/list')
  }

  async getCategories(): Promise<{ message: string; categories: string[] }> {
    return this.request<{ message: string; categories: string[] }>('/products/categories/list')
  }
}

// Singleton instance
export const apiService = new ApiService()
export default apiService
