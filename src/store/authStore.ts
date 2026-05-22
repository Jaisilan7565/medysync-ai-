import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'admin' | 'doctor' | 'receptionist' | 'patient'

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
  login: (user: User, token: string) => void
  logout: () => void
}

const demoUsers: Record<string, { user: User; password: string }> = {
  'admin@medisync.ai': {
    password: 'admin123',
    user: { id: 'U001', name: 'Dr. Admin Singh', email: 'admin@medisync.ai', role: 'admin', department: 'Administration' },
  },
  'doctor@medisync.ai': {
    password: 'doctor123',
    user: { id: 'U002', name: 'Dr. Priya Mehta', email: 'doctor@medisync.ai', role: 'doctor', department: 'Cardiology' },
  },
  'receptionist@medisync.ai': {
    password: 'recept123',
    user: { id: 'U003', name: 'Anjali Sharma', email: 'receptionist@medisync.ai', role: 'receptionist', department: 'Front Desk' },
  },
  'patient@medisync.ai': {
    password: 'patient123',
    user: { id: 'U004', name: 'Aarav Sharma', email: 'patient@medisync.ai', role: 'patient' },
  },
}

export const authenticateUser = (email: string, password: string): { user: User; token: string } | null => {
  const match = demoUsers[email.toLowerCase()]
  if (match && match.password === password) {
    return { user: match.user, token: `demo_jwt_${match.user.id}_${Date.now()}` }
  }
  return null
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'medisync-auth' }
  )
)
