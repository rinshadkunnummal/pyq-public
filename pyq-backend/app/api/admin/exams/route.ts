import { NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

export async function GET() {
  const exams = await prisma.examType.findMany({
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(exams)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const exam = await prisma.examType.create({
      data: {
        name: body.name,
        slug: body.slug,
      },
    })

    return NextResponse.json(exam, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create exam type' },
      { status: 500 }
    )
  }
}