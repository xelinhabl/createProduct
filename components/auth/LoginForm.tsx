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

  const { register, handleSubmit, formState } = useForm<LoginFormType>({
    resolver: zodResolver(LoginSchema),
  })

  const onSubmit = async (data: LoginFormType) => {
    try {
      await login(data.email, data.password)
    } catch (err) {
      alert("Erro ao autenticar")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <div className="space-y-1">
            <Input placeholder="Email" {...register("email")} />
            {formState.errors.email && (
              <p className="text-red-500 text-sm">{formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              type="password"
              placeholder="Senha"
              {...register("password")}
            />
            {formState.errors.password && (
              <p className="text-red-500 text-sm">{formState.errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
      </Card>
    </div>
  )
}
