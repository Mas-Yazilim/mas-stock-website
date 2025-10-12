import React from 'react'
import { Product } from '../types'
import ProductRow from './ProductRow'
import MobileProductCard from './MobileProductCard'
import { getCategoryIcon, getCategoryLabel } from '@/shared/utils/categoryIcons'

interface ProductTableProps {
  products: Product[]
}

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  // Ürünleri kategorilere göre grupla
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = []
    }
    acc[product.category].push(product)
    return acc
  }, {} as Record<string, Product[]>)

  const categories = Object.keys(groupedProducts)

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
        <div className="text-gray-300 mb-6">
          <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">😔 Ürün Bulunamadı</h3>
        <p className="text-gray-600 text-lg mb-4">Arama kriterlerinize uygun ürün bulunmuyor.</p>
        <p className="text-sm text-gray-500">Farklı bir arama terimi deneyin veya filtreleri değiştirin.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          {/* Kategori Başlığı - Daha Modern */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-3xl">{getCategoryIcon(category)}</span>
                <span>{getCategoryLabel(category)}</span>
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">
                  {groupedProducts[category].length} ürün
                </span>
              </div>
            </div>
          </div>

          {/* Masaüstü Tablo */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-2 font-semibold text-gray-900">
                    Model
                  </th>
                  <th className="text-right py-4 px-2 font-semibold bg-primary-50 text-primary-700 rounded-lg">
                    Nakit
                  </th>
                  <th className="text-right py-4 px-2 font-semibold bg-secondary-50 text-secondary-700 rounded-lg">
                    VISA
                  </th>
                </tr>
              </thead>
              <tbody>
              {groupedProducts[category].map((product) => (
                <ProductRow key={product._id} product={product} />
              ))}
              </tbody>
            </table>
          </div>

          {/* Mobil Kart Görünümü */}
          <div className="md:hidden space-y-4">
            {groupedProducts[category].map((product) => (
              <MobileProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductTable
