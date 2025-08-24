'use client'

import { User } from '@/types/auth'
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react' // Import useRef
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { jwtDecode } from 'jwt-decode'
import { refreshToken as callRefreshAccessToken } from '@/services/auth'

interface AuthContextType {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  login: (userData: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  refreshAccessToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)

  const maxAge = 30 * 24 * 60 * 60 // 30 dias

  const initialized = useRef(false)

  const isTokenExpired = useCallback((token: string) => {
    try {
      const decoded: any = jwtDecode(token)
      if (!decoded.exp) {
        return false
      }
      const currentTime = Date.now() / 1000
      return decoded.exp < currentTime
    } 
    catch (error) {
      console.error("Erro ao decodificar token:", error)
      return true
    }
  }, [])

  const logout = () => {
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)
    destroyCookie(null, 'user', { path: '/' })
    destroyCookie(null, 'accessToken', { path: '/' })
    destroyCookie(null, 'refreshToken', { path: '/' })
  }

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) {
      console.warn("Nenhum refresh token disponível. Não foi possível atualizar o token de acesso.")
      return
    }
    try {
      const response = await callRefreshAccessToken(refreshToken)

      setAccessToken(response.accessToken)
      setCookie(null, 'accessToken', response.accessToken, {
        maxAge: maxAge,
        path: '/',
      })
    } catch (error) {
      console.error("Falha ao atualizar o token de acesso:", error)
      logout()
    }
  }, [refreshToken, logout])

  // Efeito de carga inicial
  useEffect(() => {
    if (initialized.current) {
      return
    }

    const cookies = parseCookies()
    const storedUser = cookies.user ? JSON.parse(cookies.user) : null
    const storedAccessToken = cookies.accessToken || null
    const storedRefreshToken = cookies.refreshToken || null

    if (storedUser && storedAccessToken && storedRefreshToken) {
      if (isTokenExpired(storedAccessToken)) {
        console.log("Token de acesso expirado na inicialização. Tentando atualizar...")
        refreshAccessToken()
      } 
      else {
        setUser(storedUser)
        setAccessToken(storedAccessToken)
        setRefreshToken(storedRefreshToken)
      }
    } 
    else {
      logout()
    }

    initialized.current = true
  }, [isTokenExpired, refreshAccessToken, logout])

  const login = (userData: User, newAccessToken: string, newRefreshToken: string) => {
    setUser(userData)
    setAccessToken(newAccessToken)
    setRefreshToken(newRefreshToken)

    setCookie(null, 'user', JSON.stringify(userData), {maxAge: maxAge,path: '/',})
    setCookie(null, 'accessToken', newAccessToken, {maxAge: maxAge, path: '/',})
    setCookie(null, 'refreshToken', newRefreshToken, {maxAge: maxAge, path: '/', })
  }

  // Verifica a expiração do token periodicamente (opcional, mas bom para sessões de longa duração)
  useEffect(() => {
    const minutes =  1 * 60 * 1000 // Verifica a cada 1 minuto

    const interval = setInterval(() => {
      if (accessToken && isTokenExpired(accessToken)) {
        console.log("Token de acesso expirado durante a verificação de intervalo. Tentando atualizar...")
        refreshAccessToken()
      }
    }, minutes)

    return () => clearInterval(interval)
  }, [accessToken, isTokenExpired, refreshAccessToken])

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
