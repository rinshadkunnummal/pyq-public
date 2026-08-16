import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET() {
  const papers = await prisma.paper.findMany({
    include: {
      subject: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return NextResponse.json(papers)
}

export async function POST(req: Request) {
  const body = await req.json()

  const paper = await prisma.paper.create({
    data: {
      title: body.title,
      examYear: body.examYear,
      paperType: body.paperType,
      pdfUrl: body.pdfUrl,
      subjectId: body.subjectId,
      uploaderName: body.uploaderName,
      uploaderEmail: body.uploaderEmail,
    },
    include: {
      subject: true,
    },
  })

  return NextResponse.json(paper)
}