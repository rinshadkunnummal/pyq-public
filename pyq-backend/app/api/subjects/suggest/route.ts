import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function POST(req: Request) {
  const body = await req.json()

  const suggestion = await prisma.subjectSuggestion.create({
    data: {
      name: body.name,
      stage: body.stage,
      year: body.year,
      suggestedBy: body.suggestedBy,
    },
  })

  return NextResponse.json(suggestion)
}