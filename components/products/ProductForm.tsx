"use client"

import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useProducts, type Produto } from "../../hooks/useProducts"
import { Button, Input, Card } from "../ui"

/* ------------------ Zod Schema ------------------ */
const ProdutoSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  quantidade: z.coerce.number().min(1, "Quantidade inválida"),
  origem: z.string().min(2, "Origem obrigatória"),
  sku: z.string().min(2, "SKU obrigatório"),
  descricao: z.string().optional(),
})

/* ------------------ Tipagem do Form ------------------ */
type ProdutoFormInput = {
  nome: string
  quantidade: string
  origem: string
  sku: string
  descricao?: string
}

interface Props {
  editProduto?: Produto
  onFinish?: () => void
}

/* ------------------ COMPONENTE ------------------ */
export const ProductForm = ({ editProduto, onFinish }: Props) => {
  const { createProduct, updateProduct } = useProducts()

  const { register, handleSubmit, reset, formState } = useForm<ProdutoFormInput>({
    resolver: undefined, // não usamos zodResolver diretamente aqui
    defaultValues: editProduto
      ? {
          nome: editProduto.nome,
          quantidade: String(editProduto.quantidade),
          origem: editProduto.origem,
          sku: editProduto.sku,
          descricao: editProduto.descricao ?? "",
        }
      : {
          nome: "",
          quantidade: "1",
          origem: "",
          sku: "",
          descricao: "",
        },
  })

  const onSubmit: SubmitHandler<ProdutoFormInput> = async (values) => {
    try {
      // parse com Zod dentro do submit
      const data = ProdutoSchema.parse(values)

      if (editProduto) {
        await updateProduct(editProduto.id, data)
      } else {
        await createProduct(data)
      }

      reset()
      if (onFinish) onFinish()
    } catch (err: any) {
      alert(err?.message || "Erro ao salvar produto")
      console.error(err)
    }
  }

  return (
    <Card className="p-6 space-y-3">
      <h2 className="text-xl font-bold">{editProduto ? "Editar Produto" : "Criar Produto"}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Input placeholder="Nome" {...register("nome")} />
        {formState.errors.nome && <p className="text-red-500">{formState.errors.nome.message}</p>}

        <Input type="number" placeholder="Quantidade" {...register("quantidade")} />
        {formState.errors.quantidade && (
          <p className="text-red-500">{formState.errors.quantidade.message}</p>
        )}

        <Input placeholder="Origem" {...register("origem")} />
        {formState.errors.origem && <p className="text-red-500">{formState.errors.origem.message}</p>}

        <Input placeholder="SKU" {...register("sku")} />
        {formState.errors.sku && <p className="text-red-500">{formState.errors.sku.message}</p>}

        <Input placeholder="Descrição" {...register("descricao")} />
        {formState.errors.descricao && (
          <p className="text-red-500">{formState.errors.descricao.message}</p>
        )}

        <Button type="submit">{editProduto ? "Atualizar" : "Salvar"}</Button>
      </form>
    </Card>
  )
}
