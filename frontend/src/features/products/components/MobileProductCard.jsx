import React from 'react'
import ColorSwatches from './ColorSwatches.jsx'

/**
 * @param {Object} props
 * @param {import('../types').Product} props.product
 */
const MobileProductCard = ({ product }) => {
  const formatPrice = (price) => {
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
        
        {/* Accessories Display */}
        {product.accessories && product.accessories.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Aksesuarlar:</p>
            <div className="flex flex-wrap gap-1">
              {product.accessories.slice(0, 2).map((accessory, index) => (
                <div key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200">
                  <svg className="w-3 h-3 text-orange-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="font-medium text-orange-800 truncate max-w-20">{accessory.name}</span>
                  <span className="ml-1 text-orange-600 text-xs">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(accessory.price)}</span>
                </div>
              ))}
              {product.accessories.length > 2 && (
                <div className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600">
                  +{product.accessories.length - 2}
                </div>
              )}
            </div>
          </div>
        )}
        
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