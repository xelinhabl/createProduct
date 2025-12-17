"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react"
import { apolloClient } from "../lib/apollo-client"
import { useAuth } from "../context/AuthContext"
import {
  GET_PRODUTOS,
  CREATE_PRODUTO,
  UPDATE_PRODUTO,
  DELETE_PRODUTO,
} from "../lib/graphql"

/* ------------------ TIPAGEM ------------------ */
export type Produto = {
  id: string
  nome: string
  quantidade: number
  origem: string
  sku: string
  descricao?: string
  user?: {
    id: string
    name: string
  }
}

interface ProductsContextType {
  produtos: Produto[]
  loading: boolean
  error: string | null
  createProduct: (data: Omit<Produto, "id" | "user">) => Promise<void>
  updateProduct: (
    id: string,
    data: Omit<Produto, "id" | "user">
  ) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  fetchProducts: () => Promise<void>
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

/* ------------------ PROVIDER ------------------ */
export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const { token, loading: authLoading } = useAuth()

  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ------------------ FETCH ------------------ */
  const fetchProducts = useCallback(async () => {
    if (!token) return

    setLoading(true)
    setError(null)

    try {
      const { data } = await apolloClient.query<{ produtos: Produto[] }>({
        query: GET_PRODUTOS,
        fetchPolicy: "network-only",
      })

      setProdutos(data?.produtos ?? [])
    } catch (err) {
      console.error("Erro ao carregar produtos:", err)
      setError("Erro ao carregar produtos")
    } finally {
      setLoading(false)
    }
  }, [token])

  /* ------------------ LOAD INICIAL ------------------ */
  useEffect(() => {
    if (!authLoading && token) {
      fetchProducts()
    }
  }, [authLoading, token, fetchProducts])

  /* ------------------ CREATE ------------------ */
  const createProduct = async (produto: Omit<Produto, "id" | "user">) => {
    if (!token) throw new Error("Usuário não autenticado")

    await apolloClient.mutate({
      mutation: CREATE_PRODUTO,
      variables: produto,
    })

    await fetchProducts()
  }

  /* ------------------ UPDATE ------------------ */
  const updateProduct = async (
    id: string,
    produto: Omit<Produto, "id" | "user">
  ) => {
    if (!token) throw new Error("Usuário não autenticado")

    await apolloClient.mutate({
      mutation: UPDATE_PRODUTO,
      variables: { id, ...produto },
    })

    await fetchProducts()
  }

  /* ------------------ DELETE ------------------ */
  const deleteProduct = async (id: string) => {
    if (!token) throw new Error("Usuário não autenticado")

    await apolloClient.mutate({
      mutation: DELETE_PRODUTO,
      variables: { id },
    })

    await fetchProducts()
  }

  return (
    <ProductsContext.Provider
      value={{
        produtos,
        loading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

/* ------------------ HOOK ------------------ */
export const useProducts = () => {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error("useProducts must be used within ProductsProvider")
  }
  return context
}
