import React, { useState } from 'react'
import SearchBar from '@/shared/components/SearchBar'
import ProductTable from '@/features/products/components/ProductTable'
import { useProducts } from '@/hooks/useProducts'
import CategoryFilter from '@/shared/components/CategoryFilter'
  import apiService from '@/services/api'

const ProductListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [ibanCopied, setIbanCopied] = useState(false)

  const { products, loading, error, refetch } = useProducts({ 
    search: searchTerm,
    category: selectedCategory || undefined,
  })

  const [categories, setCategories] = useState<string[]>([])

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const { categories } = await apiService.getCategories()
        setCategories(categories || [])
      } catch {
        setCategories([])
      }
    }
    loadCategories()
  }, [])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleCopyIban = async () => {
    const iban = 'TR12 3456 7890 1234 5678 9012 34'
    try {
      await navigator.clipboard.writeText(iban)
      setIbanCopied(true)
      setTimeout(() => setIbanCopied(false), 1500)
    } catch {}
  }

  return (
    <div className="space-y-8">
      {/* Sayfa Başlığı - Modern ve Göze Çarpan */}
      <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          TOPTAN FİYAT LİSTESİ
        </h1>
        <p className="text-base sm:text-lg text-gray-600 flex items-center justify-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Güncel ve Doğrulanmış Fiyatlar
        </p>
      </div>

      {/* Arama ve Hızlı İletişim */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="max-w-2xl w-full">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Hızlı İletişim</p>
            <p className="text-base font-semibold text-gray-900">mehmet akif sönmez</p>
            <a href="tel:+905323727277" className="text-blue-600 hover:underline text-sm">+90 532 372 72 77</a>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => (window.location.href = 'tel:+905323727277')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >Ara</button>
            <button
              onClick={handleCopyIban}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
              title="IBAN kopyala"
            >{ibanCopied ? 'Kopyalandı' : 'IBAN'}</button>
          </div>
        </div>
      </div>

      {/* Kategori Filtresi */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />
      </div>

      {/* Ürün Tablosu */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Ürünler yükleniyor...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Hata</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => refetch()}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Tekrar Dene
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!loading && !error && <ProductTable products={products} />}

      {/* İletişim Bölümü */}
      <div className="mt-12">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50" />
          <div className="relative p-6 sm:p-8 border border-gray-100 bg-white/60 backdrop-blur rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a2 2 0 011.789 1.106l1.14 2.28a2 2 0 01-.45 2.336L9.7 10.3a16 16 0 006 6l1.578-1.06a2 2 0 012.336-.45l2.28 1.14A2 2 0 0121 19.72V23a2 2 0 01-2 2h-1C8.82 25 3 19.18 3 12V11a2 2 0 012-2h0" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">İletişim</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Sol: Kişi ve Telefon */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wide text-gray-500">İsim</p>
                    <p className="text-lg font-semibold text-gray-900">mehmet akif sönmez</p>
                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500">Telefon</p>
                      <div className="flex items-center gap-3 mt-1">
                        <a href="tel:+905323727277" className="text-base font-medium text-blue-700 hover:underline">+90 532 372 72 77</a>
                        <button
                          onClick={() => (window.location.href = 'tel:+905323727277')}
                          className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 shadow"
                        >Ara</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sağ: IBAN kutusu */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-gray-500">Örnek IBAN</p>
                <div className="mt-2 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <span className="font-mono text-gray-900 tracking-wider select-all">TR12 3456 7890 1234 5678 9012 34</span>
                  <button
                    onClick={handleCopyIban}
                    className="ml-3 text-sm px-3 py-1.5 bg-gray-900 text-white rounded-md hover:bg-black"
                  >{ibanCopied ? 'Kopyalandı' : 'Kopyala'}</button>
                </div>
                <p className="mt-2 text-xs text-gray-500">Not: Bu bir örnek IBAN’dır.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListPage
