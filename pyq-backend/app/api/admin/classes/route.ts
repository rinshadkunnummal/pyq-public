import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET(req: NextRequest) {
  const exam = req.nextUrl.searchParams.get('exam')

  const classes = await prisma.classLevel.findMany({
    where: exam
      ? {
          examType: {
            slug: exam,
          },
        }
      : undefined,
    orderBy: {
      slug: 'asc',
    },
    distinct: ['slug'],
  })

  return NextResponse.json(classes)
}