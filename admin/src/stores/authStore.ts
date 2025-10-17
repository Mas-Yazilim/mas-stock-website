import { create } from 'zustand'
import { apiEndpoint } from '@/shared/config'

interface Admin {
  id: string
  name: string
  email: string
  role: string
}

interface AuthStore {
  isAuthenticated: boolean
  admin: Admin | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
}

// Helper functions for localStorage
const getStoredAuth = (): { token: string | null; admin: Admin | null; isAuthenticated: boolean } => {
  if (typeof window === 'undefined') return { token: null, admin: null, isAuthenticated: false }
  
  const token = localStorage.getItem('auth-token')
  const adminStr = localStorage.getItem('auth-admin')
  const admin = adminStr ? JSON.parse(adminStr) : null
  
  return {
    token,
    admin,
    isAuthenticated: !!(token && admin)
  }
}

const setStoredAuth = (token: string | null, admin: Admin | null, isAuthenticated: boolean) => {
  if (typeof window === 'undefined') return
  
  if (token) {
    localStorage.setItem('auth-token', token)
  } else {
    localStorage.removeItem('auth-token')
  }
  
  if (admin) {
    localStorage.setItem('auth-admin', JSON.stringify(admin))
  } else {
    localStorage.removeItem('auth-admin')
  }
  
  localStorage.setItem('auth-isAuthenticated', String(isAuthenticated))
}

export const useAuthStore = create<AuthStore>((set, get) => {
  // Initialize from localStorage
  const stored = getStoredAuth()
  
  return {
    isAuthenticated: stored.isAuthenticated,
    admin: stored.admin,
    token: stored.token,

    login: async (email: string, password: string) => {
      try {
        const response = await fetch(apiEndpoint('/auth/login'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Giriş başarısız')
        }

        const data = await response.json()
        
        set({
          isAuthenticated: true,
          admin: data.admin,
          token: data.token,
        })
        
        setStoredAuth(data.token, data.admin, true)
      } catch (error) {
        throw error
      }
    },

    logout: () => {
      set({
        isAuthenticated: false,
        admin: null,
        token: null,
      })
      
      setStoredAuth(null, null, false)
    },

    checkAuth: () => {
      const { token, admin } = get()
      if (token && admin) {
        set({ isAuthenticated: true })
      }
    },
  }
})
