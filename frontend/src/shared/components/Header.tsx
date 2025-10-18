import React from 'react'

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
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
