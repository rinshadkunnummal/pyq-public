import { NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

export async function GET() {
  const classes = await prisma.classLevel.findMany({
    include: {
      examType: true,
    },
    orderBy: [
      { examType: { name: 'asc' } },
      { label: 'asc' },
    ],
  })

  return NextResponse.json(classes)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const classLevel = await prisma.classLevel.create({
      data: {
        label: body.label,
        slug: body.slug,
        examTypeId: body.examTypeId,
      },
    })

    return NextResponse.json(classLevel, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    )
  }
}