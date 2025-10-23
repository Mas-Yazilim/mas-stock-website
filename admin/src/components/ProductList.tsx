import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { apiEndpoint } from '@/shared/config'
import ProductEditModal from './ProductEditModal'
import ProductDeleteModal from './ProductDeleteModal'

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
  cashPrice: number
  visaPrice: number
  isActive: boolean
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrand] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { token } = useAuthStore()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(apiEndpoint('/products'), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        try {
          const data = await response.json()
          console.warn('Auth 401:', data)
        } catch {}
        // Token geçersiz/expired ise oturumu kapat
        useAuthStore.getState().logout()
        alert('Oturum süreniz doldu. Lütfen tekrar giriş yapın.')
        return
      }

      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.model.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesBrand = !selectedBrand || product.brand === selectedBrand
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && product.isActive) ||
      (statusFilter === 'inactive' && !product.isActive)

    return matchesSearch && matchesBrand && matchesStatus
  })

  const handleEditModalClose = () => {
    setEditModalOpen(false)
    setSelectedProduct(null)
  }

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false)
    setSelectedProduct(null)
  }

  const handleProductUpdate = () => {
    loadProducts()
  }

  const handleProductDelete = () => {
    loadProducts()
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-2 text-gray-600">Ürünler yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Ürün Listesi</h2>
        <div className="flex space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">Tüm Ürünler</option>
            <option value="active">Aktif Ürünler</option>
            <option value="inactive">Pasif Ürünler</option>
          </select>
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field max-w-xs"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Ürün</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Marka</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Depolama</th>
            
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Nakit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Visa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="flex space-x-1 mt-1">
                      {product.colors.slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-md border border-gray-400"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                      {product.colors.length > 3 && (
                        <div className="w-4 h-4 rounded-full bg-gray-300 border border-gray-300 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            +{product.colors.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.storage}</td>
              
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(product.cashPrice)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(product.visaPrice)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-4 py-2 text-xs font-semibold rounded-md border border-gray-300 ${
                        product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      {/* Düzenle Butonu */}
                      <button
                        onClick={() => {
                          setSelectedProduct(product)
                          setEditModalOpen(true)
                        }}
                        className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        title="Düzenle"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {/* Aktiflik toggle (güç ikonu) */}
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch(apiEndpoint(`/products/${product._id}?toggle=true`), {
                              method: 'DELETE',
                              headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                              }
                            })
                            if (res.ok) {
                              await res.json()
                              loadProducts()
                            } else if (res.status === 401) {
                              useAuthStore.getState().logout()
                              alert('Oturum süreniz doldu.')
                            } else {
                              console.error('Toggle failed')
                            }
                          } catch (err) {
                            console.error('Toggle error', err)
                          }
                        }}
                        className={`flex items-center justify-center w-10 h-10 text-white rounded-lg transition-all duration-200 transform hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          product.isActive ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 focus:ring-yellow-500' : 'bg-gradient-to-r from-gray-400 to-gray-500'
                        }`}
                        title={product.isActive ? 'Pasifleştir' : 'Aktifleştir'}
                      >
                        {/* Power icon */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v10m5.657 2.343A8 8 0 1110.343 4.343" />
                        </svg>
                      </button>

                      {/* Kalıcı silme butonu (çöp kutusu) */}
                      <button
                        onClick={async () => {
                          if (!confirm('Bu ürünü veritabanından kalıcı olarak silmek istediğinize emin misiniz?')) return
                          try {
                            const res = await fetch(apiEndpoint(`/products/${product._id}?hard=true`), {
                              method: 'DELETE',
                              headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                              }
                            })
                            if (res.ok) {
                              await res.json()
                              loadProducts()
                            } else if (res.status === 401) {
                              useAuthStore.getState().logout()
                              alert('Oturum süreniz doldu.')
                            } else {
                              console.error('Hard delete failed')
                            }
                          } catch (err) {
                            console.error('Hard delete error', err)
                          }
                        }}
                        className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        title="Ürünü kalıcı sil"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProductEditModal
        isOpen={editModalOpen}
        onClose={handleEditModalClose}
        onSave={handleProductUpdate}
        product={selectedProduct}
      />

      <ProductDeleteModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onDelete={handleProductDelete}
        product={selectedProduct}
      />
    </div>
  )
}

export default ProductList
