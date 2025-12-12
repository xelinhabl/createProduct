"use client"

import { useProducts } from "../../hooks/useProducts"
import { Button, Card } from "../ui"

interface Props {
  onEdit?: (id: string) => void
}

export const ProductList = ({ onEdit }: Props) => {
  const { produtos, deleteProduct } = useProducts()

  return (
    <Card className="p-6 space-y-3">
      <h2 className="text-lg font-semibold">Produtos</h2>
      <ul className="space-y-2">
        {produtos.map((p) => (
          <li key={p.id} className="flex justify-between items-center">
            <div>
              <strong>{p.nome}</strong> — {p.quantidade} unidades
              <br />
              <small>{p.sku}</small>
              <br />
              <small>Criado por: {p.user?.name ?? "Desconhecido"}</small>
            </div>
            <div className="space-x-2">
              {onEdit && <Button size="sm" onClick={() => onEdit(p.id)}>Editar</Button>}
              <Button size="sm" variant="destructive" onClick={() => deleteProduct(p.id)}>Excluir</Button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
