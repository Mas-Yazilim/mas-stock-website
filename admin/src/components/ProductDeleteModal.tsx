import React, { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { apiEndpoint } from '@/shared/config'

interface Product {
  _id: string
  name: string
  brand: string
  model: string
  storage: string
  category: string
  colors: Array<{
    name: string
    hex: string
    available: boolean
  }>
  accessories?: Array<{
    name: string
    description?: string
    price: number
    available: boolean
  }>
  cashPrice: number
  visaPrice: number
  isActive: boolean
}

interface ProductDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  product: Product | null
}

const ProductDeleteModal: React.FC<ProductDeleteModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  product
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { token } = useAuthStore()

  const handleDelete = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!product) return

    setLoading(true)
    setError('')

    try {
      // Use toggle mode so the same action can deactivate or reactivate the product
      const url = apiEndpoint(`/products/${product._id}?toggle=true`)
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        useAuthStore.getState().logout()
        setError('Oturum süreniz doldu. Lütfen tekrar giriş yapın.')
        return
      }

      if (response.ok) {
        // optionally read returned product for further UX, but reload list is fine
        onDelete()
        onClose()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Ürün silinirken bir hata oluştu')
      }
    } catch (err) {
      setError('Ürün silinirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className={`w-12 h-12 rounded-full mr-4 flex items-center justify-center ${product.isActive ? 'bg-red-100' : 'bg-green-100'}`}>
              <svg className={`w-6 h-6 ${product.isActive ? 'text-red-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{product.isActive ? 'Ürünü Pasifleştir' : 'Ürünü Aktifleştir'}</h3>
              <p className="text-sm text-gray-500">{product.isActive ? 'Bu işlem ürünü pasifleştirir; kullanıcılar tarafından görünmez hale gelir.' : 'Bu işlem ürünü tekrar aktifleştirir; kullanıcılar tarafından görüntülenebilir olacaktır.'}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              <strong>"{product.name}"</strong> ürününü silmek istediğinizden emin misiniz?
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Marka:</span> {product.brand}</p>
                <p><span className="font-medium">Model:</span> {product.model}</p>
                <p><span className="font-medium">Depolama:</span> {product.storage}</p>
                <p><span className="font-medium">Kategori:</span> {product.category}</p>
                <p><span className="font-medium">Renkler:</span> {product.colors?.length || 0} adet</p>
                {product.accessories && product.accessories.length > 0 && (
                  <p><span className="font-medium">Aksesuarlar:</span> {product.accessories.length} adet</p>
                )}
              </div>
            </div>

            <div className={`mt-4 p-3 rounded-lg ${product.isActive ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
              <div className="flex">
                <svg className={`w-5 h-5 mr-2 mt-0.5 ${product.isActive ? 'text-yellow-600' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium ${product.isActive ? 'text-yellow-800' : 'text-green-800'}">{product.isActive ? 'Dikkat!' : 'Bilgi'}</p>
                  <p className={`text-sm ${product.isActive ? 'text-yellow-700' : 'text-green-700'}`}>
                    {product.isActive ? 'Bu ürün pasifleştirilecek ve kullanıcılar tarafından görülemeyecek.' : 'Bu ürün aktif hale getirilecek ve kullanıcılar tarafından tekrar görüntülenebilecek.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 transform hover:scale-105 hover:shadow-md"
            >
              İptal
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-lg ${product.isActive ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800' : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'}`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {product.isActive ? 'Pasifleştiriliyor...' : 'Aktifleştiriliyor...'}
                </div>
              ) : (
                product.isActive ? 'Ürünü Pasifleştir' : 'Ürünü Aktifleştir'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDeleteModal