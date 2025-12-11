"use client"

import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, concat } from "@apollo/client"

// Link que aponta para sua API GraphQL
const httpLink = new HttpLink({
  uri: "http://localhost:3000/api/graphql",
})

// Link para adicionar o token JWT no header Authorization
const authMiddleware = new ApolloLink((operation, forward) => {
  // Pega o token armazenado localmente (localStorage, cookie ou outra forma)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  // Adiciona o header Authorization
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  }))

  return forward(operation)
})

// Cria o Apollo Client
export const apolloClient = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
})
