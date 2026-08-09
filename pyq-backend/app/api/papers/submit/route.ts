import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export function GET() {
  return NextResponse.json({ message: 'Use POST to submit a paper' })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      stage,
      level,
      subject,
      examType,
      paperYear,
      pdfUrl,
      uploaderName,
    } = body

    if (
      !stage ||
      !level ||
      !subject ||
      !examType ||
      !paperYear ||
      !pdfUrl
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const paper = await prisma.paper.create({
      data: {
        stage,
        level,
        subject,
        examType,
        paperYear: Number(paperYear),
        pdfUrl,
        uploaderName,
      },
    })

    return NextResponse.json({ success: true, paper }, { status: 201 })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}