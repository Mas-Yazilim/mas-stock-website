import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { apiEndpoint } from '../shared/config'

interface Accessory {
  _id: string
  name: string
  description: string
  price: number
  category: string
  colors: string[]
  status: 'active' | 'inactive'
  image: string
  stock: number
  createdAt: string
  updatedAt: string
}

interface AccessoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  accessory?: Accessory
}

const AccessoryModal: React.FC<AccessoryModalProps> = ({ isOpen, onClose, onSuccess, accessory }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    colors: [] as string[],
    image: '',
    stock: '0'
  })
  const [newColor, setNewColor] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [loading, setLoading] = useState(false)
  const { token } = useAuthStore()

  useEffect(() => {
    if (accessory) {
      setFormData({
        name: accessory.name,
        description: accessory.description,
        price: accessory.price.toString(),
        category: accessory.category,
        colors: [...accessory.colors],
        image: accessory.image,
        stock: accessory.stock.toString()
      })
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        colors: [],
        image: '',
        stock: '0'
      })
    }
    setNewColor('')
    setNewCategory('')
    setIsAddingCategory(false)
  }, [accessory, isOpen])

  useEffect(() => {
    if (isOpen) {
      loadCategories()
    }
  }, [isOpen])

  const loadCategories = async () => {
    try {
      const response = await fetch(apiEndpoint('/accessories/categories'))
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error)
    }
  }

  const addNewCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()]
      setCategories(updatedCategories)
      setFormData(prev => ({ ...prev, category: newCategory.trim() }))
      setNewCategory('')
      setIsAddingCategory(false)
    }
  }

  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()]
      }))
      setNewColor('')
    }
  }

  const removeColor = (colorToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(color => color !== colorToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = accessory 
        ? apiEndpoint(`/accessories/${accessory._id}`)
        : apiEndpoint('/accessories')
      
      const method = accessory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        })
      })

      if (response.ok) {
        onSuccess()
        onClose()
        // Form'u sıfırla
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          colors: [],
          image: '',
          stock: '0'
        })
      } else {
        const error = await response.json()
        console.error('Aksesuar kaydetme hatası:', error)
      }
    } catch (error) {
      console.error('API hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {accessory ? 'Aksesuar Düzenle' : 'Yeni Aksesuar Ekle'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Aksesuar Adı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aksesuar Adı *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Aksesuar adını girin"
              />
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none"
                placeholder="Aksesuar açıklamasını girin"
              />
            </div>

            {/* Fiyat ve Stok */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fiyat (₺) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stok Adedi
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Kategori Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori *
              </label>
              <div className="space-y-2">
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Kategori seçin</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                {!isAddingCategory ? (
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(true)}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    + Yeni kategori ekle
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Yeni kategori adı"
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={addNewCategory}
                      className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
                    >
                      Ekle
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(false)}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                    >
                      İptal
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Renk Yönetimi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Renkler
              </label>
              <div className="space-y-3">
                {/* Mevcut Renkler */}
                {formData.colors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.colors.map((color, index) => (
                      <div key={index} className="flex items-center bg-gray-100 rounded-lg px-3 py-1">
                        <span className="text-sm">{color}</span>
                        <button
                          type="button"
                          onClick={() => removeColor(color)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Yeni Renk Ekleme */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Renk adı (örn: Siyah, Beyaz)"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
                  >
                    Renk Ekle
                  </button>
                </div>
              </div>
            </div>

            {/* Resim URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resim URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Butonlar */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : (accessory ? 'Güncelle' : 'Ekle')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const AccessoryList: React.FC = () => {
  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAccessory, setEditingAccessory] = useState<Accessory | undefined>()
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const { token } = useAuthStore()

  // Debounce arama terimi
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300) // 300ms bekle (daha hızlı tepki)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // İlk yükleme
  useEffect(() => {
    loadCategories()
  }, [])

  // Arama ve kategori değiştiğinde
  useEffect(() => {
    loadAccessories()
  }, [selectedCategory, debouncedSearchTerm])

  const loadAccessories = async () => {
    // İlk yüklemede loading göster, sonraki aramalarda gösterme (input focus kaybını önlemek için)
    if (accessories.length === 0) {
      setLoading(true)
    }
    
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (debouncedSearchTerm.trim()) params.append('search', debouncedSearchTerm.trim())
      
      const url = params.toString() 
        ? `${apiEndpoint('/accessories')}?${params}`
        : apiEndpoint('/accessories')
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        // Backend'den gelen veri yapısını kontrol et
        setAccessories(data.accessories || data || [])
      } else {
        console.error('Aksesuar yükleme hatası:', response.status)
        setAccessories([])
      }
    } catch (error) {
      console.error('Aksesuarlar yüklenirken hata:', error)
      setAccessories([])
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch(apiEndpoint('/accessories/categories'))
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error)
    }
  }

  const handleEdit = (accessory: Accessory) => {
    setEditingAccessory(accessory)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Bu aksesuarı silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(apiEndpoint(`/accessories/${id}`), {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          loadAccessories()
        }
      } catch (error) {
        console.error('Aksesuar silme hatası:', error)
      }
    }
  }

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      const response = await fetch(apiEndpoint(`/accessories/${id}/status`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (response.ok) {
        loadAccessories()
      }
    } catch (error) {
      console.error('Durum değiştirme hatası:', error)
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingAccessory(undefined)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Aksesuarlar</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Aksesuar Ekle
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Aksesuar ara (isim, kategori, renk, açıklama)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                title="Temizle"
              >
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        {(searchTerm || selectedCategory !== 'all') && (
          <div className="mt-3 text-sm text-gray-600">
            {loading ? (
              <span>Aranıyor...</span>
            ) : (
              <span>
                <strong>{accessories.length}</strong> aksesuar bulundu
                {searchTerm && ` - "${searchTerm}" için`}
                {selectedCategory !== 'all' && ` - ${selectedCategory} kategorisinde`}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Accessories Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {accessories.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Arama sonucu bulunamadı' 
                : 'Henüz aksesuar yok'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== 'all'
                ? 'Farklı bir arama kriteri deneyin.'
                : 'İlk aksesuarınızı ekleyerek başlayın.'}
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <button
                onClick={() => setModalOpen(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
              >
                Aksesuar Ekle
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksesuar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accessories.map((accessory) => (
                  <tr key={accessory._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {accessory.image && (
                          <img
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                            src={accessory.image}
                            alt={accessory.name}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {accessory.name}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {accessory.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {accessory.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₺{accessory.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {accessory.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(accessory._id, accessory.status)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          accessory.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {accessory.status === 'active' ? 'Aktif' : 'Pasif'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(accessory)}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(accessory._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AccessoryModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSuccess={loadAccessories}
        accessory={editingAccessory}
      />
    </div>
  )
}

export default AccessoryList