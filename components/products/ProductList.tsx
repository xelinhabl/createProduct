"use client"

import { useState } from "react"
import { useProducts } from "../../hooks/useProducts"
import { Button, Card } from "../ui"

interface Props {
  onEdit?: (id: string) => void
}

export const ProductList = ({ onEdit }: Props) => {
  const { produtos, deleteProduct } = useProducts()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await deleteProduct(id)
    setDeletingId(null)
  }

  return (
    <Card className="max-w-4xl mx-auto bg-zinc-900/80 border border-zinc-700 rounded-2xl p-8 shadow-xl space-y-6">
      <h2 className="text-2xl font-semibold text-white text-center">
        Produtos Cadastrados
      </h2>

      <div className="space-y-4">
        {produtos.map((p) => (
          <div
            key={p.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-zinc-800 border border-zinc-700 rounded-xl p-5"
          >
            <div className="text-zinc-200 space-y-1">
              <p className="font-semibold text-lg">{p.nome}</p>
              <p className="text-sm text-zinc-400">
                {p.quantidade} unidades • SKU {p.sku}
              </p>
              <p className="text-xs text-zinc-500">
                Criado por {p.user?.name ?? "Desconhecido"}
              </p>
            </div>

            <div className="flex gap-2">
              {onEdit && (
                <Button
                  size="sm"
                  onClick={() => onEdit(p.id)}
                  className="bg-indigo-600 hover:bg-indigo-500"
                >
                  Editar
                </Button>
              )}

              <Button
                size="sm"
                variant="destructive"
                disabled={deletingId === p.id}
                onClick={() => handleDelete(p.id)}
                className="flex items-center gap-2 disabled:opacity-60"
              >
                {deletingId === p.id && (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                Excluir
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
