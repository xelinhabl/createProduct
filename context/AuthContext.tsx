"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { apolloClient } from "../lib/apollo"
import { LOGIN } from "../lib/graphql"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  token: string | null
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("userName")

    if (savedToken) setToken(savedToken)
    if (savedUser) setUser({ id: "", name: savedUser, email: "" }) // Id/email podem vir do backend se necessário

    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: LOGIN,
        variables: { email, password },
      }) as any

      if (!data?.login?.token) throw new Error("Login falhou")

      setToken(data.login.token)
      setUser(data.login.user)

      localStorage.setItem("token", data.login.token)
      localStorage.setItem("userName", data.login.user.name)
    } catch (err) {
      console.error(err)
      throw new Error("Erro ao logar")
    }
  }

  const logout = () => {
    localStorage.clear()
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
