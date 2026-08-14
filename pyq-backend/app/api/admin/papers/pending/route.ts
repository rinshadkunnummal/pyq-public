import { NextResponse } from 'next/server'
import { prisma } from '../../../../../src/lib/prisma'
import { PaperStatus } from '@prisma/client'

export async function GET() {
  const papers = await prisma.paper.findMany({
    where: {
      status: PaperStatus.PENDING,
    },
    include: {
      subject: {
        include: {
          classLevel: {
            include: {
              examType: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(papers)
}