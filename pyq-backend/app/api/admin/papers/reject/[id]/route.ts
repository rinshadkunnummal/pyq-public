import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const paper = await prisma.paper.update({
      where: { id },
      data: {
        status: 'REJECTED',
      },
    })

    return NextResponse.json(paper)
  } catch (error) {
    console.error('REJECT ERROR', error)

    return NextResponse.json(
      {
        error: 'Failed to reject paper',
        details: String(error),
      },
      { status: 500 }
    )
  }
}