"use client"

import { useState } from "react"
import { apolloClient } from "../lib/apollo"
import { LOGIN } from "../lib/graphql"

// 👇 TIPAGEM DO RETORNO DA MUTATION
interface LoginResponse {
  login: {
    token: string
    user: {
      id: string
      name: string
      email: string
    }
  }
}

export default function LoginComponent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userName, setUserName] = useState("")

  const handleLogin = async () => {
    try {
      const { data } = await apolloClient.mutate<LoginResponse>({
        mutation: LOGIN,
        variables: { email, password },
      })

      if (!data) {
        alert("Erro inesperado: sem dados retornados.")
        return
      }

      localStorage.setItem("token", data.login.token)
      setUserName(data.login.user.name)

      alert(`Login realizado com sucesso! Bem-vindo ${data.login.user.name}`)
    } catch (error) {
      console.error(error)
      alert("Erro ao logar")
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      {userName && <p>Logado como: {userName}</p>}
    </div>
  )
}
