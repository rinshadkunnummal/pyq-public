import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET(req: NextRequest) {
  const exam = req.nextUrl.searchParams.get('exam')
  const classSlug = req.nextUrl.searchParams.get('class')

  const subjects = await prisma.subject.findMany({
    where: {
      classLevel: {
        slug: classSlug ?? undefined,
        examType: exam
          ? {
              slug: exam,
            }
          : undefined,
      },
    },
    orderBy: {
      code: 'asc',
    },
    distinct: ['code'],
  })

  return NextResponse.json(subjects)
}