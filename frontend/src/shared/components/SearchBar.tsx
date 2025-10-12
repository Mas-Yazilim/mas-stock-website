import React, { useState } from 'react'

interface SearchBarProps {
  onSearch: (term: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <div className="relative w-full">
      <div className="relative group">
        <input
          type="text"
          placeholder="🔍 Marka, model veya ürün adı ile ara..."
          value={searchTerm}
          onChange={handleInputChange}
          className="w-full pl-14 pr-12 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
        />
        
        {/* Arama İkonu */}
        <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
          <svg 
            className="w-6 h-6 text-blue-500 group-focus-within:text-blue-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>

        {/* Temizle Butonu */}
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-all duration-200 bg-gray-100 hover:bg-red-50 rounded-full p-1.5"
            aria-label="Aramayı temizle"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Arama İpucu */}
      {searchTerm && (
        <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>"{searchTerm}" için sonuçlar gösteriliyor</span>
        </div>
      )}
    </div>
  )
}

export default SearchBar
