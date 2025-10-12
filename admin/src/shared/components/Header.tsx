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
              {/* Türkiye Haritası Logo */}
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 100 100" 
                  fill="none" 
                  className="text-white"
                >
                  {/* Türkiye Haritası SVG */}
                  <path 
                    d="M20 30 L30 25 L40 20 L50 22 L60 25 L65 30 L70 40 L68 50 L65 60 L60 70 L55 75 L45 80 L35 82 L25 80 L20 70 L18 60 L20 50 L22 40 L20 30 Z" 
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                  <path 
                    d="M55 75 L60 70 L65 60 L68 50 L70 40 L72 35 L75 30 L80 35 L82 45 L80 55 L75 65 L70 75 L65 80 L60 82 L55 75 Z" 
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="0.5"
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
