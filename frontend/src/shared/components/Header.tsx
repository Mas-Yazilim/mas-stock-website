import React from 'react'

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Logo ve Şirket Adı */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* Türkiye Haritası Logo */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl flex items-center justify-center shadow-md transform hover:scale-105 transition-transform">
                <svg 
                  width="28" 
                  height="28" 
                  viewBox="0 0 100 100" 
                  fill="none" 
                  className="text-blue-600 sm:w-8 sm:h-8"
                >
                  {/* Türkiye Haritası SVG - Basitleştirilmiş */}
                  <path 
                    d="M20 30 L30 25 L40 20 L50 22 L60 25 L65 30 L70 40 L68 50 L65 60 L60 70 L55 75 L45 80 L35 82 L25 80 L20 70 L18 60 L20 50 L22 40 L20 30 Z" 
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                  {/* Anadolu kısmı */}
                  <path 
                    d="M55 75 L60 70 L65 60 L68 50 L70 40 L72 35 L75 30 L80 35 L82 45 L80 55 L75 65 L70 75 L65 80 L60 82 L55 75 Z" 
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
                  MAS TEKNOLOJİ
                </h1>
                <p className="text-sm sm:text-base text-blue-100">
                  📱 Toptan Fiyat Listesi
                </p>
              </div>
            </div>
          </div>

          {/* Tarih ve Bilgi */}
          <div className="flex items-center space-x-4">
            <div className="text-left sm:text-right bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-xs sm:text-sm text-blue-100 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date().toLocaleDateString('tr-TR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-xs text-blue-200 mt-1">
                Güncel fiyatlar
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
