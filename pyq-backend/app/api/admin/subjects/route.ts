import { NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

export async function GET() {
  const subjects = await prisma.subject.findMany({
    include: {
      classLevel: {
        include: {
          examType: true,
        },
      },
    },
    orderBy: { code: 'asc' },
  })

  return NextResponse.json(subjects)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const subject = await prisma.subject.create({
      data: {
        code: body.code,
        name: body.name,
        classLevelId: body.classLevelId,
      },
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create subject' },
      { status: 500 }
    )
  }
}