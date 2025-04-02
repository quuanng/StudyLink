// AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { getAccessToken, getRefreshToken, deleteTokens, storeTokens, refreshAccessToken, validateToken } from '../utils/auth'
import backend from '../backend'
import { AxiosError } from 'axios'

export interface AuthUser {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (userData: AuthUser, accessToken: string, refreshToken: string) => void
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
    const accessToken = await getAccessToken()
    const refreshToken = await getRefreshToken()

    if (!accessToken || !refreshToken) {
      setUser(null)
      return
    }

    try {
      // First try to validate the current access token
      const userData = await validateToken(accessToken)
      if (userData) {
        setUser(userData)
        return
      }

      // If access token is invalid, try to refresh it
      console.log("Refreshing access token")
      const response = await backend.post('/login/refresh-token', { refreshToken })
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: refreshedUser } = response.data

      if (newAccessToken && newRefreshToken && refreshedUser) {
        // Store the new tokens
        await storeTokens(newAccessToken, newRefreshToken)
        setUser(refreshedUser)
      } else {
        throw new Error('Invalid response from refresh token endpoint')
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      // Only delete tokens if we get an unauthorized error or if the refresh token is invalid
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        await deleteTokens()
      }
      setUser(null)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const login = async (userData: AuthUser, accessToken: string, refreshToken: string) => {
    await storeTokens(accessToken, refreshToken)
    setUser(userData)
  }

  const logout = async () => {
    const refreshToken = await getRefreshToken()
    if (refreshToken) {
      try {
        await backend.post('/login/logout', { refreshToken })
      } catch (error) {
        console.error('Error during logout:', error)
      }
    }
    await deleteTokens()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}
