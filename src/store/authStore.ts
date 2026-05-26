import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'admin' | 'doctor' | 'receptionist' | 'patient' | 'pharmacy'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  department?: string
  phone?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: Omit<User, 'id'>, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<void>
}

const API_URL = import.meta.env.VITE_API_URL || ''

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          })
          if (!res.ok) return false
          const data = await res.json()
          set({ user: data.user, token: data.token, isAuthenticated: true })
          return true
        } catch (err) {
          console.error(err)
          return false
        }
      },

      register: async (userData, password) => {
        try {
          const res = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...userData, password })
          })
          if (!res.ok) {
            const data = await res.json()
            throw new Error(data.error || 'Failed to register')
          }
          const data = await res.json()
          set({ user: data.user, token: data.token, isAuthenticated: true })
          return true
        } catch (err) {
          console.error(err)
          return false
        }
      },

      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      checkAuth: async () => {
        const { token } = get()
        if (!token) return
        try {
          const res = await fetch(`${API_URL}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (res.ok) {
            const data = await res.json()
            set({ user: data.user, isAuthenticated: true })
          } else {
            set({ user: null, token: null, isAuthenticated: false })
          }
        } catch (err) {
          console.error('Failed to check auth:', err)
        }
      }
    }),
    { name: 'medisync-auth' }
  )
)
