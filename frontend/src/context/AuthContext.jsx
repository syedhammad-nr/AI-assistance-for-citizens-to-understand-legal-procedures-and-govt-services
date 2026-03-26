import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('citizen-assist-token')

    if (!token) {
      setLoading(false)
      return
    }

    api
      .get('/auth/me')
      .then((response) => {
        setUser(response.data.user)
      })
      .catch(() => {
        localStorage.removeItem('citizen-assist-token')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(payload) {
        const response = await api.post('/auth/login', payload)
        localStorage.setItem('citizen-assist-token', response.data.token)
        setUser(response.data.user)
        return response.data.user
      },
      async register(payload) {
        const response = await api.post('/auth/register', payload)
        localStorage.setItem('citizen-assist-token', response.data.token)
        setUser(response.data.user)
        return response.data.user
      },
      async refreshUser() {
        const response = await api.get('/auth/me')
        setUser(response.data.user)
        return response.data.user
      },
      logout() {
        localStorage.removeItem('citizen-assist-token')
        setUser(null)
      },
      setUser,
    }),
    [loading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
