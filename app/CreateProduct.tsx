"use client"

import { useState } from "react"
import { apolloClient } from "../lib/apollo"
import { CREATE_PRODUTO } from "../lib/graphql"

// Tipagem do retorno do mutation
interface CreateProdutoResponse {
  createProduto: {
    id: string
    nome: string
    quantidade: number
    origem: string
    sku: string
    descricao?: string
  }
}

export default function CreateProdutoComponent() {
  const [nome, setNome] = useState("")
  const [quantidade, setQuantidade] = useState(0)
  const [origem, setOrigem] = useState("")
  const [sku, setSku] = useState("")
  const [descricao, setDescricao] = useState("")

  const handleCreate = async () => {
    try {
      const { data } = await apolloClient.mutate<CreateProdutoResponse>({
        mutation: CREATE_PRODUTO,
        variables: { nome, quantidade, origem, sku, descricao },
      })

      if (!data) {
        alert("Erro inesperado: nenhum dado retornado.")
        return
      }

      alert(`Produto criado: ${data.createProduto.nome}`)
    } catch (error) {
      console.error(error)
      alert("Erro ao criar produto. Certifique-se de estar logado.")
    }
  }

  return (
    <div>
      <h2>Criar Produto</h2>

      <input
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        placeholder="Quantidade"
        type="number"
        value={quantidade}
        onChange={(e) => setQuantidade(Number(e.target.value))}
      />

      <input
        placeholder="Origem"
        value={origem}
        onChange={(e) => setOrigem(e.target.value)}
      />

      <input
        placeholder="SKU"
        value={sku}
        onChange={(e) => setSku(e.target.value)}
      />

      <input
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />

      <button onClick={handleCreate}>Criar Produto</button>
    </div>
  )
}
