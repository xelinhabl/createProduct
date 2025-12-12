"use client"

import { useState, useEffect, useCallback } from "react"
import { apolloClient } from "../lib/apollo"
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
  user?: { id: string; name: string }
}

/* ------------------ HOOK ------------------ */
export const useProducts = () => {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  /* ------------------ FETCH ------------------ */
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apolloClient.query<{ produtos: Produto[] }>({
        query: GET_PRODUTOS,
        fetchPolicy: "network-only",
      })

      if (result.data?.produtos) {
        setProdutos(result.data.produtos)
      } else {
        setProdutos([])
        console.warn("Nenhum produto encontrado")
      }
    } catch (err: any) {
      setError("Erro ao carregar produtos")
      console.error("Erro ao carregar produtos:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  /* ------------------ CREATE ------------------ */
  const createProduct = async (produto: Omit<Produto, "id" | "user">) => {
    try {
      await apolloClient.mutate({
        mutation: CREATE_PRODUTO,
        variables: produto,
      })
      await fetchProducts()
    } catch (err: any) {
      console.error("Erro ao criar produto:", err)
      throw new Error(err?.message || "Erro ao criar produto")
    }
  }

  /* ------------------ UPDATE ------------------ */
  const updateProduct = async (id: string, produto: Omit<Produto, "id" | "user">) => {
    try {
      await apolloClient.mutate({
        mutation: UPDATE_PRODUTO,
        variables: { id, ...produto },
      })
      await fetchProducts()
    } catch (err: any) {
      console.error("Erro ao atualizar produto:", err)
      throw new Error(err?.message || "Erro ao atualizar produto")
    }
  }

  /* ------------------ DELETE ------------------ */
  const deleteProduct = async (id: string) => {
    try {
      await apolloClient.mutate({
        mutation: DELETE_PRODUTO,
        variables: { id },
      })
      await fetchProducts()
    } catch (err: any) {
      console.error("Erro ao deletar produto:", err)
      throw new Error(err?.message || "Erro ao deletar produto")
    }
  }

  /* ------------------ LOAD INICIAL ------------------ */
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

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
