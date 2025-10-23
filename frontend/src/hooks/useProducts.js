import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@/services/api.js'

/**
 * @typedef {Object} UseProductsParams
 * @property {string} [category]
 * @property {string} [brand]
 * @property {string} [search]
 */

/**
 * @typedef {Object} UseProductsReturn
 * @property {import('../features/products/types').Product[]} products
 * @property {boolean} loading
 * @property {string|null} error
 * @property {() => Promise<void>} refetch
 */

/**
 * @param {UseProductsParams} [params]
 * @returns {UseProductsReturn}
 */
export const useProducts = (params) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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