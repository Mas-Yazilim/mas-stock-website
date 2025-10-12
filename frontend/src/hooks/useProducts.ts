import { useState, useEffect, useCallback } from 'react'
import { apiService, Product } from '@/services/api'

interface UseProductsParams {
  category?: string
  brand?: string
  search?: string
}

interface UseProductsReturn {
  products: Product[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useProducts = (params?: UseProductsParams): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiService.getProducts(params)
      setProducts(response.products || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ürünler yüklenirken bir hata oluştu')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [params?.category, params?.brand, params?.search])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  }
}
