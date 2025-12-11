import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type Params = {
  params: {
    id: string
  }
}

// GET /api/produtos/:id
export async function GET(
  request: Request,
  { params }: Params
) {
  const produto = await prisma.produto.findUnique({
    where: { id: params.id },
  })

  if (!produto) {
    return NextResponse.json(
      { error: "Produto não encontrado" },
      { status: 404 }
    )
  }

  return NextResponse.json(produto)
}

// PUT /api/produtos/:id
export async function PUT(
  request: Request,
  { params }: Params
) {
  const body = await request.json()

  const produto = await prisma.produto.update({
    where: { id: params.id },
    data: {
      nome: body.nome,
      quantidade: body.quantidade,
      origem: body.origem,
      sku: body.sku,
      descricao: body.descricao,
    },
  })

  return NextResponse.json(produto)
}

// DELETE /api/produtos/:id
export async function DELETE(
  request: Request,
  { params }: Params
) {
  await prisma.produto.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ success: true })
}
