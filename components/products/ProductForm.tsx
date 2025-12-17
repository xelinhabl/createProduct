"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useProducts, type Produto } from "../../hooks/useProducts"
import { Button, Input, Card } from "../ui"

/* ------------------ Schema ------------------ */
const ProdutoSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  quantidade: z.number().min(1, "Quantidade inválida"),
  origem: z.string().min(2, "Origem obrigatória"),
  sku: z.string().min(2, "SKU obrigatório"),
  descricao: z.string().optional(),
})

type ProdutoFormInput = z.infer<typeof ProdutoSchema>

interface Props {
  editProduto?: Produto
  onFinish?: () => void
}

export const ProductForm = ({ editProduto, onFinish }: Props) => {
  const { createProduct, updateProduct } = useProducts()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormInput>({
    resolver: zodResolver(ProdutoSchema),
    defaultValues: {
      nome: "",
      quantidade: 1,
      origem: "",
      sku: "",
      descricao: "",
    },
  })

  /* ------------------ Preenche o form se estiver editando ------------------ */
  useEffect(() => {
    if (editProduto) {
      reset({
        nome: editProduto.nome,
        quantidade: editProduto.quantidade,
        origem: editProduto.origem,
        sku: editProduto.sku,
        descricao: editProduto.descricao ?? "",
      })
    }
  }, [editProduto, reset])

  /* ------------------ Submit ------------------ */
  const onSubmit = async (data: ProdutoFormInput) => {
    if (editProduto) {
      await updateProduct(editProduto.id, data)
    } else {
      await createProduct(data)
    }

    // LIMPA O FORMULÁRIO E SAI DO MODO EDIÇÃO
    reset({
      nome: "",
      quantidade: 1,
      origem: "",
      sku: "",
      descricao: "",
    })

    onFinish?.()
  }

  return (
    <Card className="max-w-3xl mx-auto bg-zinc-900/80 border border-zinc-700 rounded-2xl p-8 shadow-xl space-y-6">
      {/* Título */}
      <h2 className="text-2xl font-semibold text-white text-center">
        {editProduto ? "Editar Produto" : "Novo Produto"}
      </h2>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {/* Nome */}
        <div>
          <Input
            placeholder="Nome"
            {...register("nome")}
            className="h-11 bg-zinc-800 border-zinc-700 text-white rounded-xl"
          />
          {errors.nome && (
            <p className="text-xs text-red-400 mt-1">
              {errors.nome.message}
            </p>
          )}
        </div>

        {/* Quantidade */}
        <div>
          <Input
            type="number"
            placeholder="Quantidade"
            {...register("quantidade", { valueAsNumber: true })}
            className="h-11 bg-zinc-800 border-zinc-700 text-white rounded-xl"
          />
          {errors.quantidade && (
            <p className="text-xs text-red-400 mt-1">
              {errors.quantidade.message}
            </p>
          )}
        </div>

        {/* Origem */}
        <div>
          <Input
            placeholder="Origem"
            {...register("origem")}
            className="h-11 bg-zinc-800 border-zinc-700 text-white rounded-xl"
          />
          {errors.origem && (
            <p className="text-xs text-red-400 mt-1">
              {errors.origem.message}
            </p>
          )}
        </div>

        {/* SKU */}
        <div>
          <Input
            placeholder="SKU"
            {...register("sku")}
            className="h-11 bg-zinc-800 border-zinc-700 text-white rounded-xl"
          />
          {errors.sku && (
            <p className="text-xs text-red-400 mt-1">
              {errors.sku.message}
            </p>
          )}
        </div>

        {/* Descrição */}
        <div className="md:col-span-2">
          <Input
            placeholder="Descrição (opcional)"
            {...register("descricao")}
            className="h-11 bg-zinc-800 border-zinc-700 text-white rounded-xl"
          />
        </div>

        {/* Botão */}
        <div className="md:col-span-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {editProduto ? "Atualizar Produto" : "Salvar Produto"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
