import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { apiEndpoint } from '@/shared/config'
import AccessoryModal from './AccessoryModal'

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

interface ProductEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  product: Product | null
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    brand: string;
    model: string;
    storage: string;
    category: string;
    cashPrice: string;
    visaPrice: string;
    colors: Array<{ name: string; hex: string; available: boolean }>;
    accessories: Array<{ name: string; description: string; price: string; available: boolean }>;
  }>({
    name: '',
    brand: '',
    model: '',
    storage: '',
    category: '',
    cashPrice: '',
    visaPrice: '',
    colors: [{ name: '', hex: '#000000', available: true }],
    accessories: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAccessoryModal, setShowAccessoryModal] = useState(false)
  const { token } = useAuthStore()

  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name,
        brand: product.brand,
        model: product.model,
        storage: product.storage,
        category: product.category,
        cashPrice: product.cashPrice.toString(),
        visaPrice: product.visaPrice.toString(),
        colors: product.colors || [{ name: '', hex: '#000000', available: true }],
        accessories: product.accessories?.map(acc => ({
          ...acc,
          description: acc.description || '',
          price: acc.price.toString()
        })) || []
      })
    }
  }, [product, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(apiEndpoint(`/products/${product._id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          cashPrice: Number(formData.cashPrice),
          visaPrice: Number(formData.visaPrice),
          accessories: formData.accessories.map(acc => ({
            ...acc,
            price: Number(acc.price)
          }))
        }),
      })

      if (response.status === 401) {
        useAuthStore.getState().logout()
        setError('Oturum süreniz doldu. Lütfen tekrar giriş yapın.')
        return
      }

      if (response.ok) {
        onSave()
        onClose()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Ürün güncellenirken bir hata oluştu')
      }
    } catch (err) {
      setError('Ürün güncellenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const addColor = () => {
    setFormData({
      ...formData,
      colors: [...formData.colors, { name: '', hex: '#000000', available: true }]
    })
  }

  const removeColor = (index: number) => {
    if (formData.colors.length > 1) {
      setFormData({
        ...formData,
        colors: formData.colors.filter((_, i) => i !== index)
      })
    }
  }

  const updateColor = (index: number, field: string, value: any) => {
    const newColors = [...formData.colors]
    newColors[index] = { ...newColors[index], [field]: value }
    setFormData({ ...formData, colors: newColors })
  }

  const handleAccessorySave = (accessories: any[]) => {
    setFormData({ ...formData, accessories })
  }

  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">Ürün Düzenle</h2>
            <button
              type="button"
              onClick={() => setShowAccessoryModal(true)}
              className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
            >
              <div className="w-4 h-4 mr-1 flex items-center justify-center">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="font-medium">Aksesuarlar</span>
              <span className="ml-1.5 px-1.5 py-0.5 bg-white bg-opacity-25 rounded-full text-xs font-bold">
                {formData.accessories.length}
              </span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marka</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Depolama</label>
                <input
                  type="text"
                  value={formData.storage}
                  onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nakit Fiyat (₺)</label>
                <input
                  type="number"
                  value={formData.cashPrice}
                  onChange={(e) => setFormData({ ...formData, cashPrice: e.target.value })}
                  required
                  className="input-field"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visa Fiyat (₺)</label>
                <input
                  type="number"
                  value={formData.visaPrice}
                  onChange={(e) => setFormData({ ...formData, visaPrice: e.target.value })}
                  required
                  className="input-field"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Renkler */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">Renkler</label>
                <button
                  type="button"
                  onClick={addColor}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="w-5 h-5 mr-2 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="font-medium">Renk Ekle</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.colors.map((color, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Renk Adı</label>
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) => updateColor(index, 'name', e.target.value)}
                        required
                        className="input-field"
                        placeholder="örn: Siyah, Beyaz"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Renk Kodu</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={color.hex}
                          onChange={(e) => updateColor(index, 'hex', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={color.hex}
                          onChange={(e) => updateColor(index, 'hex', e.target.value)}
                          className="input-field w-24"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`available-${index}`}
                        checked={color.available}
                        onChange={(e) => updateColor(index, 'available', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`available-${index}`} className="ml-2 block text-sm text-gray-900">
                        Mevcut
                      </label>
                    </div>
                    {formData.colors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColor(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
          </form>
        </div>

        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-lg"
          >
            {loading ? 'Güncelleniyor...' : 'Güncelle'}
          </button>
        </div>
      </div>

      <AccessoryModal
        isOpen={showAccessoryModal}
        onClose={() => setShowAccessoryModal(false)}
        onSave={handleAccessorySave}
        initialAccessories={formData.accessories}
      />
    </div>
  )
}

export default ProductEditModal