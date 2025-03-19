// AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { getToken, deleteToken, storeToken } from '../utils/auth'
import backend from '../backend'

export interface AuthUser {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (userData: AuthUser, token: string) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)

  // Attempt to refresh the user from a stored token on mount
  const refreshUser = async () => {
    const token = await getToken()
    if (token) {
      try {
        // Assume we have an endpoint to fetch the user from a token
        const response = await backend.get('/login/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(response.data.user)
      } catch (error) {
        console.error('Error fetching user from token:', error)
        await deleteToken()
        setUser(null)
      }
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const login = async (userData: AuthUser, token: string) => {
    await storeToken(token)
    setUser(userData)
  }

  const logout = async () => {
    await deleteToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}
