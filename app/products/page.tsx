"use client"

import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useProducts } from "../../hooks/useProducts"
import { ProductForm } from "../../components/products/ProductForm"
import { ProductList } from "../../components/products/ProductList"
import { Button } from "../../components/ui/Button"
import { User as UserIcon } from "lucide-react"

export default function Page() {
  const { user, logout } = useAuth()
  const { produtos } = useProducts()
  const [editId, setEditId] = useState<string | null>(null)

  const editProduto = produtos.find((p) => p.id === editId)

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      {/* ------------------ HEADER ------------------ */}
      <div className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3 text-white font-semibold">
          <UserIcon className="w-6 h-6 text-white" />
          <span>{user?.name}</span>
        </div>
        <Button onClick={logout}>Sair</Button>
      </div>

      {/* ------------------ FORM ------------------ */}
      <ProductForm
        editProduto={editProduto}
        onFinish={() => setEditId(null)}
      />

      {/* ------------------ LISTA DE PRODUTOS ------------------ */}
      <ProductList onEdit={setEditId} />
    </div>
  )
}
