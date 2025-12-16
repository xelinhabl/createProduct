"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "../../context/AuthContext"
import { Button, Input, Card } from "../ui"

const LoginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(3, "Senha muito curta"),
})

type LoginFormType = z.infer<typeof LoginSchema>

export const LoginForm = () => {
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(LoginSchema),
  })

  const onSubmit = async (data: LoginFormType) => {
    await login(data.email, data.password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950 px-4">
      <Card className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl shadow-[0_0_80px_-15px_rgba(99,102,241,0.4)] border border-white/10">

        {/* LADO ESQUERDO – BRANDING */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white">
          <h2 className="text-4xl font-bold leading-tight">
            Inventory <br /> Products
          </h2>

          <p className="mt-4 text-white/80 max-w-sm">
            Controle total de produtos, estoque e usuários em uma
            plataforma moderna e segura.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 rounded-xl p-4">
              📦 Gestão de Produtos
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              🔐 Autenticação Segura
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              ⚡ Performance
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              📊 Organização Total
            </div>
          </div>
        </div>

        {/* LADO DIREITO – FORM */}
        <div className="bg-zinc-950 p-10 md:p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Acesso ao sistema
          </h1>

          <p className="text-zinc-400 mb-8">
            Entre com suas credenciais para continuar
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* EMAIL */}
            <div className="relative">
              <Input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="
                  h-12 w-full rounded-xl
                  bg-zinc-900 border border-zinc-800
                  text-white pl-11
                  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                "
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                @
              </span>
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Input
                type="password"
                placeholder="Senha"
                {...register("password")}
                className="
                  h-12 w-full rounded-xl
                  bg-zinc-900 border border-zinc-800
                  text-white pl-11
                  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                "
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                🔒
              </span>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* BOTÃO */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full h-12 rounded-xl
                bg-gradient-to-r from-indigo-600 to-fuchsia-600
                hover:from-indigo-500 hover:to-fuchsia-500
                text-white font-semibold tracking-wide
                shadow-lg shadow-indigo-600/30
                transition-all
              "
            >
              {isSubmitting ? "Autenticando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
