import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  await prisma.classLevel.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}