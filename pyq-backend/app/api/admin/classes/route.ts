import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const exam = req.nextUrl.searchParams.get('exam')

    const classes = await prisma.classLevel.findMany({
      where: exam
        ? {
            examType: {
              slug: exam,
            },
          }
        : undefined,

      include: {
        examType: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },

      orderBy: [
        {
          slug: 'asc',
        },
      ],
    })

    return NextResponse.json(classes)
  } catch (error) {
    console.error('Failed to fetch classes:', error)

    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}