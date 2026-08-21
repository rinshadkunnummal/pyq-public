import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const subject = await prisma.subject.update({
    where: { id },
    data: {
      name: body.name,
      code: body.code,
    },
  })

  return NextResponse.json(subject)
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  await prisma.subject.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}