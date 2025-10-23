import React from 'react'
import ColorSwatches from './ColorSwatches.jsx'

/**
 * @param {Object} props
 * @param {import('../types').Product} props.product
 */
const ProductRow = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
    }).format(price)
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-200 group">
      <td className="py-5 px-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {product.brand}
              </span>
              <span>{product.model}</span>
              <span className="text-gray-400">•</span>
              <span className="font-medium text-gray-700">{product.storage}</span>
            </p>
          </div>
          
          {/* Renk Örnekleri */}
          <div className="flex-shrink-0">
            <ColorSwatches colors={product.colors} />
          </div>
        </div>
      </td>
      
      <td className="py-5 px-6 text-right">
        <div className="bg-gradient-to-r from-green-50 to-green-100 px-4 py-3 rounded-xl inline-block shadow-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-green-700 text-lg">
              {formatPrice(product.cashPrice)}
            </span>
          </div>
          <p className="text-xs text-green-600 mt-1">Nakit</p>
        </div>
      </td>
      
      <td className="py-5 px-6 text-right">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-4 py-3 rounded-xl inline-block shadow-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-purple-700 text-lg">
              {formatPrice(product.visaPrice)}
            </span>
          </div>
          <p className="text-xs text-purple-600 mt-1">Kredi Kartı</p>
        </div>
      </td>
    </tr>
  )
}

export default ProductRow