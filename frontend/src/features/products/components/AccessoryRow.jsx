import React from 'react'

/**
 * @param {Object} props
 * @param {Object} props.accessory
 * @param {number} props.index
 */
const AccessoryRow = ({ accessory, index }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
    }).format(price)
  }

  return (
    <tr className="hover:bg-orange-50/50 transition-all duration-200 group">
      <td className="py-5 px-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-400 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base group-hover:text-orange-600 transition-colors">
              {accessory.name}
            </h3>
            
            {accessory.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {accessory.description}
              </p>
            )}
            
            {/* Ürün bilgisi */}
            {accessory.productName && (
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800 font-medium">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  {accessory.productName}
                </span>
                {accessory.productBrand && (
                  <span className="text-xs text-gray-500">
                    {accessory.productBrand} {accessory.productModel}
                  </span>
                )}
              </div>
            )}
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
              {formatPrice(accessory.price)}
            </span>
          </div>
          <p className="text-xs text-green-600 mt-1">Aksesuar</p>
        </div>
      </td>
      
      <td className="py-5 px-6 text-center">
        <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border-2 ${
          accessory.available 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            accessory.available ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          {accessory.available ? 'Stokta' : 'Stok Yok'}
        </div>
      </td>
    </tr>
  )
}

export default AccessoryRow