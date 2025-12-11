import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

// Função para extrair userId do token JWT
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
    // Usuários
    users: () => prisma.user.findMany(),
    user: (_: any, { id }: { id: string }) => prisma.user.findUnique({ where: { id } }),

    // Produtos
    produtos: () => prisma.produto.findMany({ include: { user: true } }),
  },

  Mutation: {
    // Criar usuário
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

    // Login
    login: async (_: any, { email, password }: any) => {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) throw new Error("Usuário não encontrado")

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) throw new Error("Senha inválida")

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" })
      return { token, user }
    },

    // Deletar usuário
    deleteUser: async (_: any, { id }: { id: string }) => {
      try {
        await prisma.user.delete({ where: { id } })
        return true
      } catch (error) {
        console.error("Erro ao deletar usuário:", error)
        throw new Error("Não foi possível deletar o usuário")
      }
    },

    // Criar produto
    createProduto: async (_: any, args: any, context: any) => {
      const userId = context.userId
      if (!userId) throw new Error("Usuário não autenticado")

      try {
        const produto = await prisma.produto.create({
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
        return produto
      } catch (error) {
        console.error("Erro em createProduto:", error)
        throw new Error("Não foi possível criar o produto")
      }
    },

    // Atualizar produto
    updateProduto: async (_: any, args: any, context: any) => {
      const userId = context.userId
      if (!userId) throw new Error("Usuário não autenticado")

      // Verifica se o produto existe
      const produtoExistente = await prisma.produto.findUnique({ where: { id: args.id } })
      if (!produtoExistente) throw new Error("Produto não encontrado")

      try {
        const produtoAtualizado = await prisma.produto.update({
          where: { id: args.id },
          data: {
            nome: args.nome ?? produtoExistente.nome,
            quantidade: args.quantidade ?? produtoExistente.quantidade,
            origem: args.origem ?? produtoExistente.origem,
            sku: args.sku ?? produtoExistente.sku,
            descricao: args.descricao ?? produtoExistente.descricao,
          },
          include: { user: true },
        })

        if (!produtoAtualizado) throw new Error("Não foi possível atualizar o produto")
        return produtoAtualizado
      } catch (error) {
        console.error("Erro em updateProduto:", error)
        throw new Error("Não foi possível atualizar o produto")
      }
    },

    // Deletar produto
    deleteProduto: async (_: any, { id }: { id: string }, context: any) => {
      const userId = context.userId
      if (!userId) throw new Error("Usuário não autenticado")

      try {
        await prisma.produto.delete({ where: { id } })
        return true
      } catch (error) {
        console.error("Erro ao deletar produto:", error)
        throw new Error("Não foi possível deletar o produto")
      }
    },
  },
}
