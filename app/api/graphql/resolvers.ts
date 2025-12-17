import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

// ------------------ AUTH HELPER ------------------
export const getUserFromToken = (authHeader?: string) => {
  if (!authHeader) return null

  const token = authHeader.replace("Bearer ", "")
  try {
    const payload: any = jwt.verify(token, JWT_SECRET)
    return payload.userId
  } catch {
    return null
  }
}

export const resolvers = {
  Query: {
    // ------------------ USERS ------------------
    users: () => prisma.user.findMany(),
    user: (_: any, { id }: { id: string }) =>
      prisma.user.findUnique({ where: { id } }),

    // ------------------ PRODUTOS (🔐 APENAS DO USUÁRIO LOGADO) ------------------
    produtos: async (_: any, __: any, context: any) => {
      const userId = context.userId
      if (!userId) throw new Error("Usuário não autenticado")

      return prisma.produto.findMany({
        where: { userId },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      })
    },
  },

  Mutation: {
    // ------------------ USER ------------------
    createUser: async (_: any, args: any) => {
      const hashedPassword = await bcrypt.hash(args.password, 10)
      return prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: hashedPassword,
        },
      })
    },

    login: async (_: any, { email, password }: any) => {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) throw new Error("Usuário não encontrado")

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) throw new Error("Senha inválida")

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1d",
      })

      return { token, user }
    },

    deleteUser: async (_: any, { id }: { id: string }) => {
      await prisma.user.delete({ where: { id } })
      return true
    },

    // ------------------ PRODUTOS ------------------
    createProduto: async (_: any, args: any, context: any) => {
      const userId = context.userId
      if (!userId) throw new Error("Usuário não autenticado")

      return prisma.produto.create({
        data: {
          nome: args.nome,
          quantidade: args.quantidade,
          origem: args.origem,
          sku: args.sku,
          descricao: args.descricao ?? "",
          userId,
        },
        include: { user: true },
      })
    },

    updateProduto: async (_: any, args: any, context: any) => {
      const userId = context.userId
      if (!userId) throw new Error("Usuário não autenticado")

      const produto = await prisma.produto.findFirst({
        where: {
          id: args.id,
          userId,
        },
      })

      if (!produto) {
        throw new Error("Produto não encontrado ou acesso negado")
      }

      return prisma.produto.update({
        where: { id: args.id },
        data: {
          nome: args.nome ?? produto.nome,
          quantidade: args.quantidade ?? produto.quantidade,
          origem: args.origem ?? produto.origem,
          sku: args.sku ?? produto.sku,
          descricao: args.descricao ?? produto.descricao,
        },
        include: { user: true },
      })
    },

    deleteProduto: async (_: any, { id }: { id: string }, context: any) => {
      const userId = context.userId
      if (!userId) throw new Error("Usuário não autenticado")

      const produto = await prisma.produto.findFirst({
        where: {
          id,
          userId,
        },
      })

      if (!produto) {
        throw new Error("Produto não encontrado ou acesso negado")
      }

      await prisma.produto.delete({ where: { id } })
      return true
    },
  },
}
