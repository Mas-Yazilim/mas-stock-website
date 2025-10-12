export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    'TELEFON': '📱',
    'TABLET': '📱',
    'LAPTOP': '💻',
    'AKILLI SAAT': '⌚',
    'KULAKLIK': '🎧',
    'KAMERA': '📷',
    'DİĞER': '🔧',
  }
  
  return icons[category] || '📦'
}

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    'TELEFON': 'Telefon',
    'TABLET': 'Tablet',
    'LAPTOP': 'Laptop',
    'AKILLI SAAT': 'Akıllı Saat',
    'KULAKLIK': 'Kulaklık',
    'KAMERA': 'Kamera',
    'DİĞER': 'Diğer',
  }
  
  return labels[category] || category
}
