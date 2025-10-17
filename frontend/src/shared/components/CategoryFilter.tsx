import React from 'react'

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void
  selectedCategory: string
  categories?: string[]
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onCategoryChange, selectedCategory, categories }) => {
  const items = [{ value: '', label: 'Tüm Kategoriler' }].concat(
    (categories || []).map((c) => ({ value: c, label: c }))
  )

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {items.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedCategory === category.value
              ? 'bg-primary-600 text-white shadow-md transform scale-105'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-primary-300'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
