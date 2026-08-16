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

  return NextResponse.json(paper)
}