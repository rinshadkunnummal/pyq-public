import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const stage = searchParams.get('stage')
  const level = searchParams.get('level')
  const subject = searchParams.get('subject')

  const papers = await prisma.paper.findMany({
    where: {
      status: 'approved',
      ...(stage && { stage }),
      ...(level && { level }),
      ...(subject && { subject }),
    },
    orderBy: {
      paperYear: 'desc',
    },
  })

  return NextResponse.json(papers)
}