import React from 'react'
import { Product } from '../types'
import ColorSwatches from './ColorSwatches'

interface MobileProductCardProps {
  product: Product
}

const MobileProductCard: React.FC<MobileProductCardProps> = ({ product }) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
    }).format(price)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {/* Ürün Adı ve Renkler */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-2">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          {product.brand} {product.model} - {product.storage}
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Renkler:</span>
          <ColorSwatches colors={product.colors} maxVisible={4} />
        </div>
      </div>

      {/* Fiyatlar */}
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <div className="bg-primary-50 px-3 py-2 rounded-lg mb-1">
            <span className="text-xs text-primary-600 font-medium">Nakit</span>
          </div>
          <span className="font-bold text-primary-700 text-sm">
            {formatPrice(product.cashPrice)}
          </span>
        </div>
        
        <div className="text-center">
          <div className="bg-secondary-50 px-3 py-2 rounded-lg mb-1">
            <span className="text-xs text-secondary-600 font-medium">VISA</span>
          </div>
          <span className="font-bold text-secondary-700 text-sm">
            {formatPrice(product.visaPrice)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MobileProductCard
