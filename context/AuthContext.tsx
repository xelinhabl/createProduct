"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
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
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  /* 🔑 Recupera sessão pelo cookie */
  useEffect(() => {
    const tokenCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]

    if (tokenCookie) {
      setToken(tokenCookie)

      // ⚠️ Ideal: buscar user pelo backend
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    }

    setLoading(false)
  }, [])

  /* 🔐 LOGIN */
  const login = async (email: string, password: string) => {
    const { data } = await apolloClient.mutate({
      mutation: LOGIN,
      variables: { email, password },
    }) as any

    if (!data?.login?.token) {
      throw new Error("Falha no login")
    }

    const { token, user } = data.login

    // 🍪 salva cookie (server-friendly)
    document.cookie = `token=${token}; path=/`

    setToken(token)
    setUser(user)

    localStorage.setItem("user", JSON.stringify(user))

    router.push("/products")
  }

  /* 🚪 LOGOUT */
  const logout = () => {
    document.cookie = "token=; Max-Age=0; path=/"
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
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
