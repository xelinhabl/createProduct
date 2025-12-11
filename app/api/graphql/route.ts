import { ApolloServer } from "@apollo/server"
import { startServerAndCreateNextHandler } from "@as-integrations/next"
import { typeDefs } from "./typeDefs"
import { resolvers, getUserFromToken } from "./resolvers"

// Função auxiliar para extrair o token de headers
function getAuthHeader(context: any): string {
  // App Router (Request padrão Web)
  if (context.headers && typeof context.headers.get === "function") {
    return context.headers.get("authorization") || ""
  }
  // API Route (NextApiRequest)
  if (context.headers && typeof context.headers.authorization === "string") {
    return context.headers.authorization
  }
  return ""
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = startServerAndCreateNextHandler(server, {
  context: async (integrationContext) => {
    const authHeader = getAuthHeader(integrationContext)
    const userId = getUserFromToken(authHeader)
    return { userId }
  },
})

export { handler as GET, handler as POST }
