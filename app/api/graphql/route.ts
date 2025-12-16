import { ApolloServer } from "@apollo/server"
import { NextRequest } from "next/server"
import { typeDefs } from "./typeDefs"
import { resolvers, getUserFromToken } from "./resolvers"

export interface GraphQLContext {
  userId: string | null
}

const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
})

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || ""
    const userId = getUserFromToken(authHeader)

    const body = await req.json()

    const result = await server.executeOperation(
      {
        query: body.query,
        variables: body.variables,
        operationName: body.operationName,
      },
      {
        contextValue: { userId },
      }
    )

    // 🔥🔥🔥 AQUI ESTÁ O BUG QUE QUEBRAVA TUDO 🔥🔥🔥
    if (result.body.kind === "single") {
      return new Response(
        JSON.stringify(result.body.singleResult),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    return new Response(
      JSON.stringify({ errors: [{ message: "Unsupported response type" }] }),
      { status: 500 }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ errors: [{ message: error.message }] }),
      { status: 500 }
    )
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({ message: "GraphQL endpoint. Use POST." }),
    { status: 200 }
  )
}
