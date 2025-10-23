import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { apiEndpoint } from '@/shared/config'

interface Accessory {
  name: string
  description: string
  price: string
  available: boolean
  category?: string
  colors?: string[]
}

interface AccessoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (accessories: Accessory[]) => void
  initialAccessories?: Accessory[]
}

const AccessoryModal: React.FC<AccessoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialAccessories = []
}) => {
  const [accessories, setAccessories] = useState<Accessory[]>(initialAccessories)
  const [categories, setCategories] = useState<string[]>([])
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const { token } = useAuthStore()

  useEffect(() => {
    if (isOpen) {
      setAccessories(initialAccessories.length > 0 ? initialAccessories : [])
      loadCategories()
    }
  }, [initialAccessories, isOpen])

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

  const addAccessory = () => {
    setAccessories([
      ...accessories,
      { 
        name: '', 
        description: '', 
        price: '', 
        available: true,
        category: '',
        colors: []
      }
    ])
  }

  const addNewCategory = async () => {
    if (!newCategory.trim()) return
    setLoading(true)

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
        
        if (!categories.includes(categoryName)) {
          setCategories([...categories, categoryName].sort())
        }
        
        setShowNewCategoryInput(false)
        setNewCategory('')
      }
    } catch (err) {
      console.error('Kategori eklenirken hata:', err)
    } finally {
      setLoading(false)
    }
  }

  const addColorToAccessory = (accessoryIndex: number) => {
    const newAccessories = [...accessories]
    if (!newAccessories[accessoryIndex].colors) newAccessories[accessoryIndex].colors = []
    newAccessories[accessoryIndex].colors!.push('')
    setAccessories(newAccessories)
  }

  const removeColorFromAccessory = (accessoryIndex: number, colorIndex: number) => {
    const newAccessories = [...accessories]
    const colors = newAccessories[accessoryIndex].colors || []
    if (colors.length > 0) {
      colors.splice(colorIndex, 1)
      newAccessories[accessoryIndex].colors = colors
      setAccessories(newAccessories)
    }
  }

  const updateAccessoryColor = (accessoryIndex: number, colorIndex: number, value: string) => {
    const newAccessories = [...accessories]
    if (!newAccessories[accessoryIndex].colors) newAccessories[accessoryIndex].colors = []
    const colors = [...(newAccessories[accessoryIndex].colors || [])]
    colors[colorIndex] = value
    newAccessories[accessoryIndex].colors = colors
    setAccessories(newAccessories)
  }

  const removeAccessory = (index: number) => {
    setAccessories(accessories.filter((_, i) => i !== index))
  }

  const updateAccessory = (index: number, field: string, value: any) => {
    const newAccessories = [...accessories]
    newAccessories[index] = { ...newAccessories[index], [field]: value }
    setAccessories(newAccessories)
  }

  const handleSave = () => {
    const validAccessories = accessories.filter(acc => acc.name.trim() && acc.price.trim())
    onSave(validAccessories)
    handleClose()
  }

  const handleClose = () => {
    // Modal'ı sıfırla
    setAccessories([])
    setShowNewCategoryInput(false)
    setNewCategory('')
    setLoading(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Aksesuar Yönetimi</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">Bu ürüne ait aksesuarları ekleyin ve yönetin</p>
            <button
              onClick={addAccessory}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div className="w-5 h-5 mr-2 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="font-medium">Aksesuar Ekle</span>
            </button>
          </div>

          {accessories.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">Henüz aksesuar eklenmemiş</p>
              <p className="text-gray-400 text-sm mt-2">Yukarıdaki "Aksesuar Ekle" butonuna tıklayarak başlayın</p>
            </div>
          ) : (
            <div className="space-y-4">
              {accessories.map((accessory, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aksesuar Adı *
                      </label>
                      <input
                        type="text"
                        value={accessory.name}
                        onChange={(e) => updateAccessory(index, 'name', e.target.value)}
                        required
                        className="input-field"
                        placeholder="örn: Kılıf, Şarj Aleti"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fiyat (₺) *
                      </label>
                      <input
                        type="number"
                        value={accessory.price}
                        onChange={(e) => updateAccessory(index, 'price', e.target.value)}
                        required
                        className="input-field"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama
                    </label>
                    <textarea
                      value={accessory.description}
                      onChange={(e) => updateAccessory(index, 'description', e.target.value)}
                      className="input-field"
                      placeholder="Aksesuar açıklaması"
                      rows={2}
                    />
                  </div>

                  {/* Kategori Seçimi */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    {!showNewCategoryInput ? (
                      <div className="flex gap-2">
                        <select
                          value={accessory.category}
                          onChange={(e) => {
                            if (e.target.value === '__new__') {
                              setShowNewCategoryInput(true)
                            } else {
                              updateAccessory(index, 'category', e.target.value)
                            }
                          }}
                          className="input-field flex-1"
                        >
                          <option value="">Kategori seçin</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                          <option value="__new__">+ Yeni Kategori Ekle</option>
                        </select>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value.toUpperCase())}
                          placeholder="Kategori adı (örn: KILIF, SARJ)"
                          className="input-field flex-1"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={addNewCategory}
                          disabled={!newCategory.trim() || loading}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50"
                        >
                          {loading ? '...' : '✓'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowNewCategoryInput(false)
                            setNewCategory('')
                          }}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                   {/* Renk Seçimi */}
                   <div className="mb-4">
                     <div className="flex justify-between items-center mb-2">
                       <label className="block text-sm font-medium text-gray-700">
                         Renkler
                       </label>
                       <button
                         type="button"
                         onClick={() => addColorToAccessory(index)}
                         className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                       >
                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                         </svg>
                         Renk Ekle
                       </button>
                     </div>

                     <div className="space-y-2">
                       {(accessory.colors || []).map((color, colorIndex) => (
                         <div key={colorIndex} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-white">
                           <div className="flex-1">
                             <label className="block text-xs font-medium text-gray-700 mb-1">Renk Adı</label>
                             <input
                               type="text"
                               value={color}
                               onChange={(e) => updateAccessoryColor(index, colorIndex, e.target.value)}
                               placeholder="örn: Siyah, Beyaz, Kırmızı"
                               className="input-field w-full"
                             />
                           </div>
                           <button
                             type="button"
                             onClick={() => removeColorFromAccessory(index, colorIndex)}
                             className="text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-red-50"
                             title="Rengi Sil"
                           >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                             </svg>
                           </button>
                         </div>
                       ))}
                       
                       {(!accessory.colors || accessory.colors.length === 0) && (
                         <div className="text-center py-4 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                           Henüz renk eklenmemiş. "Renk Ekle" butonuna tıklayın.
                         </div>
                       )}
                     </div>
                   </div>                  {/* Durum ve Sil */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`accessory-available-${index}`}
                        checked={accessory.available}
                        onChange={(e) => updateAccessory(index, 'available', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`accessory-available-${index}`} className="ml-2 block text-sm text-gray-900">
                        Mevcut
                      </label>
                    </div>
                    
                    <button
                      onClick={() => removeAccessory(index)}
                      className="flex items-center justify-center w-8 h-8 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-110"
                      title="Aksesuar'ı Sil"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="btn-primary"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccessoryModal