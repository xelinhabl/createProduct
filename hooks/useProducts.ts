"use client"

import { useState, useEffect, useCallback } from "react"
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

/* ------------------ HOOK ------------------ */
export const useProducts = () => {
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

  /* ------------------ LOAD INICIAL ------------------ */
  useEffect(() => {
    if (!authLoading && token) {
      fetchProducts()
    }
  }, [authLoading, token, fetchProducts])

  return {
    produtos,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
