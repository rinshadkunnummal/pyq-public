import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const paper = await prisma.paper.update({
    where: { id },
    data: {
      status: 'APPROVED',
      approvedAt: new Date(),
    },
  })

  const res = NextResponse.json(paper)
  res.headers.set('Access-Control-Allow-Origin', '*')
  return res
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}