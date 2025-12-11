import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// CREATE
export async function POST(req: Request) {
  const body = await req.json()

  const produto = await prisma.produto.create({
    data: {
      nome: body.nome,
      quantidade: body.quantidade,
      origem: body.origem,
      sku: body.sku,
      descricao: body.descricao,
    },
  })

  return NextResponse.json(produto, { status: 201 })
}

// READ (LIST)
export async function GET() {
  const produtos = await prisma.produto.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(produtos)
}
