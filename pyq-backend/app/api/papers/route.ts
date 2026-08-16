import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET(req: NextRequest) {
  const stage = req.nextUrl.searchParams.get('stage')
  const year = req.nextUrl.searchParams.get('year')
  const subject = req.nextUrl.searchParams.get('subject')

  const papers = await prisma.paper.findMany({
    where: {
      status: 'APPROVED',

      subject: {
        is: {
          stage: stage ? (stage as any) : undefined,
          year: year ? Number(year) : undefined,
          name: subject || undefined,
        },
      },
    },

    include: {
      subject: true,
    },

    orderBy: {
      examYear: 'desc',
    },
  })

  return NextResponse.json(papers)
}