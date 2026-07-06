import { createContext } from 'react'
import type { User } from 'firebase/auth'

export type AuthContextType = {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)