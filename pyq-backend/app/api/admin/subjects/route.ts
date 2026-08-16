import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET(req: NextRequest) {
  const stage = req.nextUrl.searchParams.get('stage')
  const year = req.nextUrl.searchParams.get('year')

  const subjects = await prisma.subject.findMany({
    where: {
      stage: stage ? (stage as any) : undefined,
      year: year ? Number(year) : undefined,
    },
    orderBy: {
      name: 'asc',
    },
  })

  return NextResponse.json(subjects)
}

export async function POST(req: Request) {
  const body = await req.json()

  const subject = await prisma.subject.create({
    data: {
      name: body.name,
      code: body.code,
      stage: body.stage,
      year: body.year,
    },
  })

  return NextResponse.json(subject)
}