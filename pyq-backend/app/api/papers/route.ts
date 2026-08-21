import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"
import { Stage } from "@prisma/client"

const stageMap: Record<string, Stage> = {
  secondary: Stage.SECONDARY,
  "senior-secondary": Stage.SENIOR_SECONDARY,
  degree: Stage.DEGREE,
  pg: Stage.PG,
}

const yearMap: Record<string, number> = {
  "first-year": 1,
  "second-year": 2,
  "third-year": 3,
  "fourth-year": 4,
  "fifth-year": 5,
}

export async function GET(req: NextRequest) {
  try {
    const stageSlug = req.nextUrl.searchParams.get("stage")
    const yearParam = req.nextUrl.searchParams.get("year")
    const subjectId = req.nextUrl.searchParams.get("subject")

    const stage = stageSlug
      ? stageMap[stageSlug]
      : undefined

    let year: number | undefined

    if (yearParam) {
      year =
        yearMap[yearParam] ??
        Number(yearParam)

      if (!Number.isInteger(year)) {
        return NextResponse.json(
          { error: "Invalid year" },
          { status: 400 }
        )
      }
    }

    if (stageSlug && !stage) {
      return NextResponse.json(
        { error: "Invalid stage" },
        { status: 400 }
      )
    }

    const papers = await prisma.paper.findMany({
      where: {
        status: "APPROVED",

        ...(subjectId
          ? {
              subjectId,
            }
          : {}),

        ...(stage || year
          ? {
              subject: {
                ...(stage ? { stage } : {}),
                ...(year ? { year } : {}),
              },
            }
          : {}),
      },

      include: {
        subject: true,
      },

      orderBy: [
        {
          examYear: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    })

    return NextResponse.json(papers)
  } catch (error) {
    console.error("Failed to fetch papers:", error)

    return NextResponse.json(
      {
        error: "Failed to fetch papers",
      },
      {
        status: 500,
      }
    )
  }
}