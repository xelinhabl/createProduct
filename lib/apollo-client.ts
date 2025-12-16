// lib/apollo-client.ts
"use client"

import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"

const httpLink = new HttpLink({
  uri: "/api/graphql",
})

const authLink = setContext((_, { headers }) => {
  if (typeof window === "undefined") {
    return { headers }
  }

  const token = localStorage.getItem("token")

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  }
})

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
})
