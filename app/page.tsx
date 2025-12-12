"use client"

import { useState } from "react"
import { AuthProvider, useAuth } from "../context/AuthContext"
import { LoginForm } from "../components/auth/LoginForm"
import { ProductForm } from "../components/products/ProductForm"
import { ProductList } from "../components/products/ProductList"
import { Button } from "../components/ui/Button"
import { User as UserIcon } from "lucide-react"
import { useProducts } from "../hooks/useProducts"

const MainApp = () => {
  const { user, logout, loading } = useAuth()
  const { produtos } = useProducts()

  const [editId, setEditId] = useState<string | null>(null)

  if (loading) return <p>Carregando...</p>
  if (!user) return <LoginForm />

  // produto selecionado para edição
  const editProduto = produtos.find((p) => p.id === editId)

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      
      {/* Header com usuário logado */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-gray-600" />
          </div>
          <span className="font-medium text-gray-800">{user.name}</span>
        </div>

        <Button variant="secondary" onClick={logout}>Sair</Button>
      </div>

      {/* Formulário com produto selecionado */}
      <ProductForm 
        editProduto={editProduto ?? undefined}
        onFinish={() => setEditId(null)} 
      />

      {/* Lista */}
      <ProductList onEdit={(id) => setEditId(id)} />
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}
