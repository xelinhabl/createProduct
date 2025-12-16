// context/AuthContext.tsx
"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { apolloClient } from "../lib/apollo-client"
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
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }

    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await apolloClient.mutate({
      mutation: LOGIN,
      variables: { email, password },
    }) as any

    if (!data?.login?.token) {
      throw new Error("Falha no login")
    }

    const { token, user } = data.login

    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))

    setToken(token)
    setUser(user)

    router.push("/products")
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    setToken(null)
    setUser(null)

    router.push("/login")
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
