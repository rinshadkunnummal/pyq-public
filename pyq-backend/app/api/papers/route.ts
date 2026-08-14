import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const exam = searchParams.get('exam')
    const classSlug = searchParams.get('class')
    const subjectCode = searchParams.get('subject')
    const year = searchParams.get('year')

    const papers = await prisma.paper.findMany({
      where: {
        status: 'APPROVED',

        ...(year ? { examYear: Number(year) } : {}),

        ...(subjectCode || classSlug || exam
          ? {
              subject: {
                ...(subjectCode ? { code: subjectCode } : {}),

                ...(classSlug || exam
                  ? {
                      classLevel: {
                        ...(classSlug ? { slug: classSlug } : {}),

                        ...(exam
                          ? {
                              examType: {
                                slug: exam,
                              },
                            }
                          : {}),
                      },
                    }
                  : {}),
              },
            }
          : {}),
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

      orderBy: {
        examYear: 'desc',
      },
    })

    return NextResponse.json(papers)
  } catch (error) {
    console.error('PUBLIC PAPERS ERROR', error)

    return NextResponse.json(
      { error: 'Failed to fetch papers' },
      { status: 500 }
    )
  }
}