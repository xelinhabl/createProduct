"use client"

import { useState, useEffect } from "react"
import { apolloClient } from "../lib/apollo"
import {
  LOGIN,
  GET_PRODUTOS,
  CREATE_PRODUTO,
  UPDATE_PRODUTO,
  DELETE_PRODUTO,
} from "../lib/graphql"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { User } from "lucide-react" // ícone de usuário

type Produto = {
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

export default function Home() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [produtos, setProdutos] = useState<Produto[]>([])
  const [form, setForm] = useState({
    nome: "",
    quantidade: 0,
    origem: "",
    sku: "",
    descricao: "",
  })
  const [editId, setEditId] = useState<string | null>(null)
  
  // Autenticação
  const [token, setToken] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("userName")
    if (savedToken) {
      setToken(savedToken)
      if (savedUser) setUserName(savedUser)
      fetchProdutos()
    }
    setLoading(false)
  }, [])

  const fetchProdutos = async () => {
    try {
      const { data } = await apolloClient.query<{ produtos: Produto[] }>({
        query: GET_PRODUTOS,
        fetchPolicy: "network-only",
      })
      setProdutos(data?.produtos ?? [])
    } catch (err) {
      console.error("Erro ao carregar produtos:", err)
    }
  }

  const handleLogin = async () => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: LOGIN,
        variables: { email, password },
      }) as any

      if (!data?.login?.token) throw new Error("Login falhou")

      localStorage.setItem("token", data.login.token)
      localStorage.setItem("userName", data.login.user.name) // salva nome do usuário
      setToken(data.login.token)
      setUserName(data.login.user.name)

      alert("Autenticado com sucesso!")
      fetchProdutos()
    } catch (err) {
      console.error(err)
      alert("Erro ao autenticar!")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userName")
    setToken(null)
    setUserName(null)
    setForm({ nome: "", quantidade: 0, origem: "", sku: "", descricao: "" })
    setEditId(null)
    setProdutos([])
  }

  const handleSubmit = async () => {
    try {
      if (editId) {
        await apolloClient.mutate({
          mutation: UPDATE_PRODUTO,
          variables: { id: editId, ...form, quantidade: Number(form.quantidade) },
        })
      } else {
        await apolloClient.mutate({
          mutation: CREATE_PRODUTO,
          variables: { ...form, quantidade: Number(form.quantidade) },
        })
      }

      setForm({ nome: "", quantidade: 0, origem: "", sku: "", descricao: "" })
      setEditId(null)
      fetchProdutos()
    } catch (err) {
      console.error(err)
      alert("Erro ao salvar produto!")
    }
  }

  const startEdit = (produto: Produto) => {
    setEditId(produto.id)
    setForm({
      nome: produto.nome,
      quantidade: produto.quantidade,
      origem: produto.origem,
      sku: produto.sku,
      descricao: produto.descricao || "",
    })
  }

  const handleDelete = async (id: string) => {
    try {
      await apolloClient.mutate({ mutation: DELETE_PRODUTO, variables: { id } })
      fetchProdutos()
    } catch (err) {
      console.error(err)
      alert("Erro ao deletar produto!")
    }
  }

  if (loading) return <p>Carregando...</p>

  if (!token) {
    return (
      <div className="p-8 max-w-3xl mx-auto space-y-6">
        <Card className="p-6 space-y-4">
          <h1 className="text-xl font-bold">Login</h1>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={handleLogin}>Entrar</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      {/* Topo com usuário logado */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-gray-600" />
          <span className="font-medium">{userName}</span>
        </div>
        <Button variant="secondary" onClick={handleLogout}>Sair</Button>
      </div>

      {/* FORMULÁRIO */}
      <Card className="p-6 space-y-4">
        <h1 className="text-xl font-bold">{editId ? "Editar Produto" : "Criar Produto"}</h1>

        <Input placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        <Input placeholder="Quantidade" type="number" value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: Number(e.target.value) })} />
        <Input placeholder="Origem" value={form.origem} onChange={(e) => setForm({ ...form, origem: e.target.value })} />
        <Input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
        <Input placeholder="Descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />

        <div className="flex gap-2">
          <Button onClick={handleSubmit}>{editId ? "Atualizar" : "Salvar"}</Button>
          {editId && (
            <Button
              variant="secondary"
              onClick={() => {
                setEditId(null)
                setForm({ nome: "", quantidade: 0, origem: "", sku: "", descricao: "" })
              }}
            >
              Cancelar
            </Button>
          )}
        </div>
      </Card>

      {/* LISTA */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Produtos</h2>
        <ul className="space-y-2">
          {produtos.map((p) => (
            <li key={p.id} className="flex justify-between items-center">
              <span>
                <strong>{p.nome}</strong> ({p.sku}) — qtd: {p.quantidade}
                <br />
                <small className="text-gray-500">Criado por: {p.user?.name ?? "—"}</small>
              </span>

              <div className="space-x-2">
                <Button size="sm" onClick={() => startEdit(p)}>Editar</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>Deletar</Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
