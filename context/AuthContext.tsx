"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
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
  logout: () => Promise<void>
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
    const { data } = (await apolloClient.mutate({
      mutation: LOGIN,
      variables: { email, password },
    })) as any

    if (!data?.login?.token) {
      throw new Error("Falha no login")
    }

    const { token, user } = data.login

    // Client
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))

    // Server (middleware)
    document.cookie = `token=${token}; path=/; max-age=86400`

    setToken(token)
    setUser(user)

    router.replace("/products")
  }

  const logout = async () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    document.cookie = "token=; path=/; max-age=0"

    setToken(null)
    setUser(null)

    router.replace("/login")
  }

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, loading }}
    >
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
