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
  registeredUsers: Record<string, { user: User; password: string }>
  login: (user: User, token: string) => void
  register: (user: User, password: string) => void
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
  'pharmacy@medisync.ai': {
    password: 'pharmacy123',
    user: { id: 'U005', name: 'MediSync Pharmacy', email: 'pharmacy@medisync.ai', role: 'pharmacy', department: 'Pharmacy' },
  },
}

export const authenticateUser = (email: string, password: string): { user: User; token: string } | null => {
  const normalizedEmail = email.toLowerCase()
  const match = demoUsers[normalizedEmail]
  if (match && match.password === password) {
    return { user: match.user, token: `demo_jwt_${match.user.id}_${Date.now()}` }
  }

  // Check stateful registered users
  const registered = useAuthStore.getState().registeredUsers || {}
  const regMatch = registered[normalizedEmail]
  if (regMatch && regMatch.password === password) {
    return { user: regMatch.user, token: `demo_jwt_${regMatch.user.id}_${Date.now()}` }
  }

  return null
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      registeredUsers: {},
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      register: (user, password) => set((state) => ({
        registeredUsers: {
          ...state.registeredUsers,
          [user.email.toLowerCase()]: { user, password },
        },
        user,
        token: `demo_jwt_${user.id}_${Date.now()}`,
        isAuthenticated: true,
      })),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'medisync-auth' }
  )
)
