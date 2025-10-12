import React from 'react'
import { ProductColor } from '../types'

interface ColorSwatchesProps {
  colors: ProductColor[]
  maxVisible?: number
}

const ColorSwatches: React.FC<ColorSwatchesProps> = ({ 
  colors, 
  maxVisible = 6 
}) => {
  const visibleColors = colors.slice(0, maxVisible)
  const remainingCount = colors.length - maxVisible

  return (
    <div className="flex items-center space-x-1">
      {visibleColors.map((color, index) => (
        <div
          key={`${color.name}-${index}`}
          className="relative group"
          title={color.name}
        >
          <div
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: color.hex }}
          />
          
          {/* Renk adı tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
            {color.name}
          </div>
        </div>
      ))}
      
      {/* Fazla renk sayısı */}
      {remainingCount > 0 && (
        <div
          className="w-4 h-4 rounded-full bg-gray-300 border-2 border-white shadow-sm flex items-center justify-center"
          title={`+${remainingCount} renk daha`}
        >
          <span className="text-xs font-medium text-gray-600">
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  )
}

export default ColorSwatches
