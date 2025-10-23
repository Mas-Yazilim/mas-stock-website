import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { apiEndpoint } from '@/shared/config'
import AccessoryModal from './AccessoryModal'

const ProductForm: React.FC = () => {
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
  const [success, setSuccess] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [brands, setBrands] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [storages, setStorages] = useState<string[]>([])

  const [showNewBrandInput, setShowNewBrandInput] = useState(false)
  const [newBrand, setNewBrand] = useState('')

  const [showNewModelInput, setShowNewModelInput] = useState(false)
  const [newModel, setNewModel] = useState('')

  const [showNewStorageInput, setShowNewStorageInput] = useState(false)
  const [newStorage, setNewStorage] = useState('')
  const [showAccessoryModal, setShowAccessoryModal] = useState(false)
  const { token } = useAuthStore()

  useEffect(() => {
    loadCategories()
    loadBrands()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await fetch(apiEndpoint('/categories'))
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error)
    }
  }

  const loadBrands = async () => {
    try {
      const response = await fetch(apiEndpoint('/products/brands/list'))
      if (response.ok) {
        const data = await response.json()
        setBrands(data.brands || [])
      }
    } catch (error) {
      console.error('Markalar yüklenemedi:', error)
    }
  }

  const loadModels = async (brand?: string) => {
    try {
      const params = brand ? `?brand=${encodeURIComponent(brand)}` : ''
      const response = await fetch(apiEndpoint(`/products/models/list${params}`))
      if (response.ok) {
        const data = await response.json()
        setModels(data.models || [])
      }
    } catch (error) {
      console.error('Modeller yüklenemedi:', error)
    }
  }

  const loadStorages = async (brand?: string, model?: string) => {
    try {
      const qs = new URLSearchParams()
      if (brand) qs.set('brand', brand)
      if (model) qs.set('model', model)
      const response = await fetch(apiEndpoint(`/products/storages/list${qs.toString() ? `?${qs}` : ''}`))
      if (response.ok) {
        const data = await response.json()
        setStorages(data.storages || [])
      }
    } catch (error) {
      console.error('Depolamalar yüklenemedi:', error)
    }
  }

  // Bağımlı yüklemeler
  useEffect(() => {
    // Marka değişince model ve depolamayı sıfırla ve yeniden yükle
    setFormData(fd => ({ ...fd, model: '', storage: '' }))
    setModels([])
    setStorages([])
    if (formData.brand) {
      loadModels(formData.brand)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.brand])

  useEffect(() => {
    // Model değişince depolamayı sıfırla ve yeniden yükle
    setFormData(fd => ({ ...fd, storage: '' }))
    setStorages([])
    if (formData.brand || formData.model) {
      loadStorages(formData.brand, formData.model)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.model])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(apiEndpoint('/products'), {
        method: 'POST',
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
        try {
          const data = await response.json()
          console.warn('Auth 401:', data)
        } catch {}
        useAuthStore.getState().logout()
        setError('Oturum süreniz doldu. Lütfen tekrar giriş yapın.')
        return
      }

      if (response.ok) {
        setSuccess('Ürün başarıyla eklendi!')
        setFormData({
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
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Ürün eklenirken bir hata oluştu')
      }
    } catch (err) {
      setError('Ürün eklenirken bir hata oluştu')
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

  const addNewCategory = async () => {
    if (!newCategory.trim()) return

    try {
      const response = await fetch(apiEndpoint('/categories'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategory.trim() }),
      })

      if (response.ok) {
        const data = await response.json()
        const categoryName = data.category
        
        // Kategoriyi listeye ekle
        if (!categories.includes(categoryName)) {
          setCategories([...categories, categoryName].sort())
        }
        
        // Form'da seç
        setFormData({ ...formData, category: categoryName })
        
        // Modal'ı kapat
        setShowNewCategoryInput(false)
        setNewCategory('')
        
        setSuccess(`Kategori "${categoryName}" ${data.exists ? 'zaten mevcuttu' : 'eklendi'}`)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Kategori eklenirken bir hata oluştu')
      }
    } catch (err) {
      setError('Kategori eklenirken bir hata oluştu')
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Yeni Ürün Ekle</h2>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowAccessoryModal(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div className="w-5 h-5 mr-2 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="font-medium">Aksesuarlar</span>
              <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs font-bold">
                {formData.accessories.length}
              </span>
            </button>
          </div>
        </div>

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
              {!showNewBrandInput ? (
                <div className="flex gap-2">
                  <select
                    value={formData.brand}
                    onChange={(e) => {
                      if (e.target.value === '__new__') {
                        setShowNewBrandInput(true)
                        setFormData({ ...formData, brand: '' })
                      } else {
                        setFormData({ ...formData, brand: e.target.value })
                      }
                    }}
                    required
                    className="input-field flex-1"
                  >
                    <option value="">Marka seçin</option>
                    {brands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                    <option value="__new__">+ Yeni Marka Ekle</option>
                  </select>
                </div>
              ) : (
                <div className="flex gap-2">
              <input
                type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="Yeni marka"
                    className="input-field flex-1"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newBrand.trim()) {
                        setFormData({ ...formData, brand: newBrand.trim() })
                        setBrands([...brands, newBrand.trim()])
                        setShowNewBrandInput(false)
                        setNewBrand('')
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewBrandInput(false)
                      setNewBrand('')
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
              {!showNewModelInput ? (
                <div className="flex gap-2">
                  <select
                    value={formData.model}
                    onChange={(e) => {
                      if (e.target.value === '__new__') {
                        setShowNewModelInput(true)
                        setFormData({ ...formData, model: '' })
                      } else {
                        setFormData({ ...formData, model: e.target.value })
                      }
                    }}
                    required
                    className="input-field flex-1"
                    disabled={!formData.brand && models.length === 0}
                  >
                    <option value="">{formData.brand ? 'Model seçin' : 'Önce marka seçin'}</option>
                    {models.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                    <option value="__new__">+ Yeni Model Ekle</option>
                  </select>
                </div>
              ) : (
                <div className="flex gap-2">
              <input
                type="text"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    placeholder="Yeni model"
                    className="input-field flex-1"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newModel.trim()) {
                        setFormData({ ...formData, model: newModel.trim() })
                        setModels([...models, newModel.trim()])
                        setShowNewModelInput(false)
                        setNewModel('')
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewModelInput(false)
                      setNewModel('')
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Depolama</label>
              {!showNewStorageInput ? (
                <div className="flex gap-2">
                  <select
                    value={formData.storage}
                    onChange={(e) => {
                      if (e.target.value === '__new__') {
                        setShowNewStorageInput(true)
                        setFormData({ ...formData, storage: '' })
                      } else {
                        setFormData({ ...formData, storage: e.target.value })
                      }
                    }}
                    required
                    className="input-field flex-1"
                    disabled={!formData.model && storages.length === 0}
                  >
                    <option value="">{formData.model ? 'Depolama seçin' : 'Önce model seçin (veya marka)'}</option>
                    {storages.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    <option value="__new__">+ Yeni Depolama Ekle</option>
                  </select>
                </div>
              ) : (
                <div className="flex gap-2">
              <input
                type="text"
                    value={newStorage}
                    onChange={(e) => setNewStorage(e.target.value)}
                    placeholder="örn: 128GB"
                    className="input-field flex-1"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newStorage.trim()) {
                        setFormData({ ...formData, storage: newStorage.trim() })
                        setStorages([...storages, newStorage.trim()])
                        setShowNewStorageInput(false)
                        setNewStorage('')
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewStorageInput(false)
                      setNewStorage('')
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Kategori
              </label>
              {!showNewCategoryInput ? (
                <div className="flex gap-2">
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      if (e.target.value === '__new__') {
                        setShowNewCategoryInput(true)
                        setFormData({ ...formData, category: '' })
                      } else {
                        setFormData({ ...formData, category: e.target.value })
                      }
                    }}
                    required
                    className="input-field flex-1"
                  >
                    <option value="">Kategori seçin</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="__new__">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Yeni Kategori Ekle
                      </div>
                    </option>
                  </select>
                </div>
              ) : (
                <div className="p-4 border-2 border-orange-200 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">Yeni Kategori Ekle</h3>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value.toUpperCase())}
                      placeholder="Kategori adı (örn: TELEFON, LAPTOP, AKSESUAR)"
                      className="input-field flex-1"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={addNewCategory}
                      disabled={!newCategory.trim()}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                      title="Kategori Ekle"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCategoryInput(false)
                        setNewCategory('')
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105"
                      title="İptal"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              {formData.category && (
                <p className="mt-1 text-sm text-gray-600">
                  Seçili: <span className="font-semibold">{formData.category}</span>
                </p>
              )}
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
                <span className="font-medium ">Renk Ekle</span>
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
                      className="flex items-center justify-center w-8 h-8 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-110"
                      title="Rengi Kaldır"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>



          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setFormData({
                name: '',
                brand: '',
                model: '',
                storage: '',
                category: '',
                cashPrice: '',
                visaPrice: '',
                colors: [{ name: '', hex: '#000000', available: true }],
                accessories: []
              })}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Temizle
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Ekleniyor...
                </>
              ) : (
                'Ürün Ekle'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}
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

export default ProductForm
