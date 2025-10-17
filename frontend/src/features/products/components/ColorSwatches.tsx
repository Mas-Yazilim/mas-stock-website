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

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const cleaned = hex.replace('#', '')
    if (!(cleaned.length === 3 || cleaned.length === 6)) return null
    const full = cleaned.length === 3
      ? cleaned.split('').map((c) => c + c).join('')
      : cleaned
    const r = parseInt(full.substring(0, 2), 16)
    const g = parseInt(full.substring(2, 4), 16)
    const b = parseInt(full.substring(4, 6), 16)
    return { r, g, b }
  }

  const isLightColor = (hex: string): boolean => {
    const rgb = hexToRgb(hex)
    if (!rgb) return false
    // Perceived luminance (ITU-R BT.709)
    const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255
    return luminance > 0.85
  }

  return (
    <div className="flex items-center space-x-1">
      {visibleColors.map((color, index) => (
        <div
          key={`${color.name}-${index}`}
          className="relative group"
          title={color.name}
        >
          <div
            className={`w-4 h-4 rounded-full shadow-sm ${isLightColor(color.hex) ? 'border border-gray-300 ring-1 ring-gray-200' : 'border border-gray-200'}`}
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
