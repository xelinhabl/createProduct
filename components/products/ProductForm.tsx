"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ZodError } from "zod"
import { useProducts, type Produto } from "../../hooks/useProducts"
import { Button, Input, Card } from "../ui"

/* ------------------ Schema Zod ------------------ */
const ProdutoSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  quantidade: z.coerce.number().min(1, "Quantidade inválida"),
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
    setError,
    reset,
    formState: { errors },
  } = useForm<ProdutoFormInput>({
    defaultValues: {
      nome: "",
      quantidade: 1,
      origem: "",
      sku: "",
      descricao: "",
    },
  })

  /* 🔥 ESSENCIAL: Atualiza o formulário quando editProduto mudar */
  useEffect(() => {
    if (editProduto) {
      reset({
        nome: editProduto.nome,
        quantidade: editProduto.quantidade,
        origem: editProduto.origem,
        sku: editProduto.sku,
        descricao: editProduto.descricao ?? "",
      })
    } else {
      reset({
        nome: "",
        quantidade: 1,
        origem: "",
        sku: "",
        descricao: "",
      })
    }
  }, [editProduto, reset])

  /* ------------------ Submit Handler ------------------ */
  const onSubmit = async (values: ProdutoFormInput) => {
    try {
      const validated = ProdutoSchema.parse(values)

      if (editProduto) {
        await updateProduct(editProduto.id, validated)
      } else {
        await createProduct(validated)
      }

      reset()
      onFinish?.()
    } catch (err) {
      if (err instanceof ZodError) {
        err.issues.forEach((issue) => {
          const field = issue.path[0] as keyof ProdutoFormInput

          setError(field, { message: issue.message })
        })
      }
    }
  }

  return (
    <Card className="p-6 space-y-3">
      <h2 className="text-xl font-bold">
        {editProduto ? "Editar Produto" : "Criar Produto"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

        <Input placeholder="Nome" {...register("nome")} />
        {errors.nome && <p className="text-red-500">{errors.nome.message}</p>}

        <Input type="number" {...register("quantidade", { valueAsNumber: true })} placeholder="Quantidade" />
        {errors.quantidade && <p className="text-red-500">{errors.quantidade.message}</p>}

        <Input placeholder="Origem" {...register("origem")} />
        {errors.origem && <p className="text-red-500">{errors.origem.message}</p>}

        <Input placeholder="SKU" {...register("sku")} />
        {errors.sku && <p className="text-red-500">{errors.sku.message}</p>}

        <Input placeholder="Descrição" {...register("descricao")} />
        {errors.descricao && <p className="text-red-500">{errors.descricao.message}</p>}

        <Button type="submit">
          {editProduto ? "Atualizar" : "Salvar"}
        </Button>
      </form>
    </Card>
  )
}
