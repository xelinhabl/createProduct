"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "../../context/AuthContext"
import { Button, Input, Card } from "../ui/"

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
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormType) => {
    try {
      await login(data.email, data.password)
    } catch (err) {
      console.error(err)
      alert("Erro ao autenticar")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl p-8 space-y-8">
        {/* Título */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo</h1>
          <p className="text-gray-500 text-sm">
            Faça login para continuar
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              E-mail
            </label>
            <Input
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
              className={`h-11 rounded-lg ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-gray-900"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Senha */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Senha
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={`h-11 rounded-lg ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-gray-900"
              }`}
            />
            {errors.password && (
              <p className="text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Botão */}
          <Button
            type="submit"
            className="w-full h-11 rounded-lg text-base font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
