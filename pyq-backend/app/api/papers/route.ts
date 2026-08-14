import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const query = searchParams.get("query")
    const stage = searchParams.get("stage")
    const level = searchParams.get("level")
    const subject = searchParams.get("subject")
    const examType = searchParams.get("examType")
    const year = searchParams.get("year")
    const sort = searchParams.get("sort") ?? "recent"

    const where: any = {
      status: "approved",
    }

    if (stage) where.stage = stage
    if (level) where.level = level
    if (subject) where.subject = subject
    if (examType) where.examType = examType

    if (year) {
      where.paperYear = Number(year)
    }

    if (query) {
      const q = query.trim()

      where.OR = [
        {
          subject: {
            contains: q,
          },
        },
        {
          examType: {
            contains: q,
          },
        },
        {
          stage: {
            contains: q,
          },
        },
        {
          level: {
            contains: q,
          },
        },
      ]
    }

    let orderBy: any = { paperYear: "desc" }

    switch (sort) {
      case "recent":
        orderBy = { paperYear: "desc" }
        break

      case "oldest":
        orderBy = { paperYear: "asc" }
        break

      case "year-desc":
        orderBy = { paperYear: "desc" }
        break

      case "year-asc":
        orderBy = { paperYear: "asc" }
        break

      case "subject":
        orderBy = { subject: "asc" }
        break
    }

    const papers = await prisma.paper.findMany({
      where,
      orderBy,
    })

    return NextResponse.json(papers)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch papers" },
      { status: 500 }
    )
  }
}