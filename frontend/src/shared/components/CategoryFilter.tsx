import React from 'react'

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void
  selectedCategory: string
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onCategoryChange, selectedCategory }) => {
  const categories = [
    { value: '', label: 'Tüm Kategoriler', icon: '📦' },
    { value: 'TELEFON', label: 'Telefon', icon: '📱' },
    { value: 'TABLET', label: 'Tablet', icon: '📱' },
    { value: 'LAPTOP', label: 'Laptop', icon: '💻' },
    { value: 'AKILLI SAAT', label: 'Akıllı Saat', icon: '⌚' },
    { value: 'KULAKLIK', label: 'Kulaklık', icon: '🎧' },
    { value: 'KAMERA', label: 'Kamera', icon: '📷' },
    { value: 'DİĞER', label: 'Diğer', icon: '🔧' },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedCategory === category.value
              ? 'bg-primary-600 text-white shadow-md transform scale-105'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-primary-300'
          }`}
        >
          <span className="mr-2">{category.icon}</span>
          {category.label}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
