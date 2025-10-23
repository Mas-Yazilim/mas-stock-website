import React from 'react'
import AccessoryRow from './AccessoryRow.jsx'

/**
 * @param {Object} props
 * @param {Array} props.accessories
 */
const AccessoryTable = ({ accessories }) => {
  if (!accessories || accessories.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz aksesuar bulunmuyor</h3>
        <p className="text-gray-600">Aksesuarlar eklendiğinde burada görünecek</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-orange-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Aksesuarlar</h2>
            <p className="text-sm text-gray-600">{accessories.length} aksesuar mevcut</p>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                Aksesuar Bilgileri
              </th>
              <th className="text-right py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                Fiyat
              </th>
              <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                Durum
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {accessories.map((accessory, index) => (
              <AccessoryRow 
                key={`${accessory.productId}-${index}`} 
                accessory={accessory} 
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AccessoryTable