import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const paper = await prisma.paper.update({
      where: { id },
      data: {
        status: "approved",
        approvedAt: new Date(),
      },
    })

    return NextResponse.json(paper)
  } catch (error) {
    console.error("Approve failed:", error)

    return NextResponse.json(
      { error: "Failed to approve paper" },
      { status: 500 }
    )
  }
}