import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { PaperStatus } from '@prisma/client'

export async function GET() {
  try {
    const papers = await prisma.paper.findMany({
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
        createdAt: 'desc',
      },
    })

    return NextResponse.json(papers)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to fetch papers' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const paper = await prisma.paper.create({
      data: {
        title: body.title,
        examYear: body.examYear,
        pdfUrl: body.pdfUrl,
        fileSize: body.fileSize ?? null,
        uploadedBy: body.uploadedBy ?? null,
        subjectId: body.subjectId,
        status: PaperStatus.PENDING,
      },
    })

    return NextResponse.json(paper, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to create paper' },
      { status: 500 }
    )
  }
}