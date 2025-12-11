"use client"

import { useEffect, useState } from "react"

// IMPORTS CORRETOS
import { apolloClient } from "../lib/apollo"
import { GET_PRODUTOS } from "../lib/graphql"

// TIPAGEM DO PRODUTO
type Produto = {
  id: string
  nome: string
  quantidade: number
  origem: string
  sku?: string
  descricao?: string
  user?: {
    id: string
    name: string
  }
}

// TIPAGEM DO RETORNO DA QUERY
type GetProdutosData = {
  produtos: Produto[]
}

export default function ProdutosListComponent() {
  const [produtos, setProdutos] = useState<Produto[]>([])

  const fetchProdutos = async () => {
    try {
      // TIPANDO A RESPOSTA
      const result = await apolloClient.query<GetProdutosData>({
        query: GET_PRODUTOS,
        fetchPolicy: "network-only",
      })

      // VERIFICAR SE DATA EXISTE
      if (result.data?.produtos) {
        setProdutos(result.data.produtos)
      } else {
        console.warn("Nenhum produto encontrado")
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    }
  }

  useEffect(() => {
    fetchProdutos()
  }, [])

  return (
    <div>
      <h2>Produtos</h2>
      <ul>
        {produtos.map((prod) => (
          <li key={prod.id}>
            {prod.nome} - {prod.quantidade} unidades - {prod.origem} (Criado por:{" "}
            {prod.user?.name || "Desconhecido"})
          </li>
        ))}
      </ul>
    </div>
  )
}