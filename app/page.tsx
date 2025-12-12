"use client"

import { useState, useEffect } from "react"
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

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
import { User } from "lucide-react"

/* ============================================================
   TIPAGEM
============================================================ */

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

/* ============================================================
   SCHEMAS ZOD
============================================================ */

const LoginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(3, "Senha muito curta"),
})

type LoginFormType = z.infer<typeof LoginSchema>

/*
  ProdutoSchema: valida e COERCE (quantidade) para number.
  Observe que z.coerce.number() permitirá que o Zod transforme a string vindo do input em number.
*/
const ProdutoSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  quantidade: z.coerce.number().min(1, "Quantidade inválida"),
  origem: z.string().min(2, "Origem obrigatória"),
  sku: z.string().min(2, "SKU obrigatório"),
  descricao: z.string().optional(),
})

/**
 * ProdutoFormInput: os tipos que o formulário realmente fornece (inputs => strings).
 * Mantemos essa distinção para agradar o react-hook-form.
 */
type ProdutoFormInput = {
  nome: string
  quantidade: string
  origem: string
  sku: string
  descricao?: string
}

/* ============================================================
   COMPONENTE PRINCIPAL
============================================================ */

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [editId, setEditId] = useState<string | null>(null)

  const [token, setToken] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  /* ---------------------- FORM LOGIN ---------------------- */

  const loginForm = useForm<LoginFormType>({
    resolver: zodResolver(LoginSchema),
  })

  /* ---------------------- FORM PRODUTO ---------------------- */

  /**
   * Aqui fazemos a correção importante:
   * - usamos useForm<ProdutoFormInput>
   * - informamos o resolver com a tipagem esperada pelo RHF:
   *   zodResolver(ProdutoSchema) as Resolver<ProdutoFormInput>
   *
   * Isso silencia o erro 2322 e é seguro porque Zod fará a conversão ao parse.
   */
  const produtoForm = useForm<ProdutoFormInput>({
    resolver: zodResolver(ProdutoSchema) as unknown as Resolver<ProdutoFormInput>,
    defaultValues: {
      nome: "",
      quantidade: "",
      origem: "",
      sku: "",
      descricao: "",
    },
  })

  /* ---------------------- TOKEN LOAD ---------------------- */

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

  /* ---------------------- FETCH PRODUTOS ---------------------- */

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

  /* ---------------------- LOGIN SUBMIT ---------------------- */

  const onLogin = async (data: LoginFormType) => {
    try {
      const response = await apolloClient.mutate({
        mutation: LOGIN,
        variables: data,
      }) as any

      if (!response.data?.login?.token) throw new Error("Login falhou")

      localStorage.setItem("token", response.data.login.token)
      localStorage.setItem("userName", response.data.login.user.name)

      setToken(response.data.login.token)
      setUserName(response.data.login.user.name)

      fetchProdutos()
    } catch {
      alert("Erro ao autenticar")
    }
  }

  /* ---------------------- LOGOUT ---------------------- */

  const handleLogout = () => {
    localStorage.clear()
    setToken(null)
    setUserName(null)
    setProdutos([])
  }

  /* ---------------------- PRODUTO SUBMIT ---------------------- */

  /**
   * Tipamos o handler como SubmitHandler<ProdutoFormInput> para que o RHF aceite
   * produtoForm.handleSubmit(onSubmitProduto) sem erro (resolve 2345).
   *
   * Dentro do handler usamos ProdutoSchema.parse(formValues) para obter a versão
   * coerida (quantidade: number).
   */
  const onSubmitProduto: SubmitHandler<ProdutoFormInput> = async (formValues) => {
    // parse + coerção (pode lançar, mas o resolver já valida; parse aqui é seguro)
    const data = ProdutoSchema.parse(formValues)

    try {
      if (editId) {
        await apolloClient.mutate({
          mutation: UPDATE_PRODUTO,
          variables: { id: editId, ...data },
        })
      } else {
        await apolloClient.mutate({
          mutation: CREATE_PRODUTO,
          variables: data,
        })
      }

      produtoForm.reset()
      setEditId(null)
      fetchProdutos()
    } catch (err) {
      console.error(err)
      alert("Erro ao salvar")
    }
  }

  /* ---------------------- EDITAR PRODUTO ---------------------- */

  const startEdit = (p: Produto) => {
    setEditId(p.id)
    produtoForm.reset({
      nome: p.nome,
      quantidade: String(p.quantidade),
      origem: p.origem,
      sku: p.sku,
      descricao: p.descricao ?? "",
    })
  }

  /* ---------------------- DELETE PRODUTO ---------------------- */

  const handleDelete = async (id: string) => {
    try {
      await apolloClient.mutate({ mutation: DELETE_PRODUTO, variables: { id } })
      fetchProdutos()
    } catch (err) {
      console.error(err)
      alert("Erro ao deletar")
    }
  }

  /* ============================================================
     RENDER
  ============================================================ */

  if (loading) return <p>Carregando...</p>

  if (!token) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <Card className="p-6 space-y-4">
          <h1 className="text-xl font-bold">Login</h1>

          <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
            <Input placeholder="Email" {...loginForm.register("email")} />
            {loginForm.formState.errors.email && (
              <p className="text-red-500 text-sm">
                {loginForm.formState.errors.email.message}
              </p>
            )}

            <Input type="password" placeholder="Senha" {...loginForm.register("password")} />
            {loginForm.formState.errors.password && (
              <p className="text-red-500 text-sm">
                {loginForm.formState.errors.password.message}
              </p>
            )}

            <Button type="submit">Entrar</Button>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      {/* Usuário logado */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-gray-600" />
          <span className="font-medium">{userName}</span>
        </div>
        <Button variant="secondary" onClick={handleLogout}>Sair</Button>
      </div>

      {/* Formulário de Produto */}
      <Card className="p-6 space-y-4">
        <h1 className="text-xl font-bold">
          {editId ? "Editar Produto" : "Criar Produto"}
        </h1>

        <form onSubmit={produtoForm.handleSubmit(onSubmitProduto)} className="space-y-3">
          <Input placeholder="Nome" {...produtoForm.register("nome")} />

          <Input
            placeholder="Quantidade"
            type="number"
            {...produtoForm.register("quantidade")}
          />

          <Input placeholder="Origem" {...produtoForm.register("origem")} />
          <Input placeholder="SKU" {...produtoForm.register("sku")} />
          <Input placeholder="Descrição" {...produtoForm.register("descricao")} />

          {Object.values(produtoForm.formState.errors).map((err, index) => (
            <p key={index} className="text-red-500 text-sm">{err?.message}</p>
          ))}

          <div className="flex gap-2">
            <Button type="submit">{editId ? "Atualizar" : "Salvar"}</Button>
            {editId && (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditId(null)
                  produtoForm.reset()
                }}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Lista de produtos */}
      <Card className="p-6 space-y-3">
        <h2 className="text-lg font-semibold">Produtos</h2>

        <ul className="space-y-2">
          {produtos.map((p) => (
            <li key={p.id} className="flex justify-between">
              <span>
                <strong>{p.nome}</strong> — {p.quantidade} unidades
                <br />
                <small className="text-gray-500">{p.sku}</small>
                <br />
                <small className="text-gray-500">
                  Criado por: {p.user?.name ?? "—"}
                </small>
              </span>

              <div className="space-x-2">
                <Button size="sm" onClick={() => startEdit(p)}>Editar</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>
                  Excluir
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}