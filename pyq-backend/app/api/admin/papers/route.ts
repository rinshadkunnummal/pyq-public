import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const papers = await prisma.paper.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(papers)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch admin papers" },
      { status: 500 }
    )
  }
}