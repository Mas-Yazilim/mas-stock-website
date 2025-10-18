import React from 'react'
import { useAuthStore } from '@/stores/authStore'

const Header: React.FC = () => {
  const { admin, logout, isAuthenticated } = useAuthStore()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo ve Şirket Adı */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* Türk Bayrağı Logo */}
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #e30a17 90%, #d10013 100%)" }}>
                <svg 
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none" 
                  className="block"
                  aria-label="Türk Bayrağı"
                >
                  {/* Kırmızı Arka Plan */}
                  <rect width="40" height="40" rx="10" fill="#e30a17" />
                  {/* Büyük Hilal */}
                  <circle cx="17" cy="20" r="10" fill="#fff" />
                  <circle cx="20" cy="20" r="7.5" fill="#e30a17" />
                  {/* Büyük Yıldız */}
                  <polygon
                    fill="#fff"
                    points="
                      29.5,20 
                      27.2,21.7 
                      28.1,19.0
                      25.8,17.4 
                      28.7,17.3 
                      29.5,14.7 
                      30.3,17.3 
                      33.2,17.4 
                      30.9,19.0 
                      31.8,21.7
                    "
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  MAS TEKNOLOJİ
                </h1>
                <p className="text-sm text-gray-600">
                  Admin Panel
                </p>
              </div>
            </div>
          </div>

          {/* Kullanıcı Bilgileri */}
          {isAuthenticated && admin && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{admin.name}</span>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
