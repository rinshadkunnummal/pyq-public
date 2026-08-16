import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET() {
  const papers = await prisma.paper.findMany({
    where: {
      status: 'PENDING',
    },
    include: {
      subject: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return NextResponse.json(papers)
}