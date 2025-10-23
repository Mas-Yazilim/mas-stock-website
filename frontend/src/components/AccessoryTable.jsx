import React, { useState, useEffect } from 'react';

const AccessoryRow = ({ accessory }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            {accessory.image ? (
              <img
                className="h-12 w-12 rounded-lg object-cover mr-4"
                src={accessory.image}
                alt={accessory.name}
              />
            ) : (
              <div className="h-12 w-12 bg-orange-100 rounded-lg mr-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            )}
            <div>
              <div className="text-lg font-semibold text-gray-900">{accessory.name}</div>
              <div className="text-sm text-gray-500">{accessory.category}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-lg font-bold text-gray-900">
            ₺{accessory.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex flex-wrap gap-1">
            {accessory.colors.slice(0, 3).map((color, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {color}
              </span>
            ))}
            {accessory.colors.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                +{accessory.colors.length - 3}
              </span>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            accessory.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {accessory.status === 'active' ? 'Mevcut' : 'Stokta Yok'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{accessory.stock || 0}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-gray-50">
          <td colSpan="6" className="px-6 py-4">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Açıklama</h4>
                <p className="text-sm text-gray-600">{accessory.description}</p>
              </div>
              {accessory.colors.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Mevcut Renkler</h4>
                  <div className="flex flex-wrap gap-2">
                    {accessory.colors.map((color, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-orange-100 text-orange-800"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Eklenme Tarihi: {new Date(accessory.createdAt).toLocaleDateString('tr-TR')}
                </div>
                <div className="text-sm text-gray-500">
                  Son Güncelleme: {new Date(accessory.updatedAt).toLocaleDateString('tr-TR')}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const AccessoryTable = () => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAccessories();
    loadCategories();
  }, [selectedCategory, searchTerm]);

  const loadAccessories = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`http://localhost:5000/api/accessories?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAccessories(data.accessories);
      }
    } catch (error) {
      console.error('Aksesuarlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/accessories/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Aksesuarlar
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {accessories.length} aksesuar bulundu
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Aksesuar ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {accessories.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aksesuar bulunamadı</h3>
          <p className="text-gray-500">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Arama kriterlerinize uygun aksesuar bulunamadı.' 
              : 'Henüz hiç aksesuar eklenmemiş.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksesuar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Renkler
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detay
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accessories.map((accessory) => (
                <AccessoryRow key={accessory._id} accessory={accessory} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AccessoryTable;