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
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,

  "first-year": 1,
  "second-year": 2,
  "third-year": 3,
  "fourth-year": 4,
  "fifth-year": 5,
}

export async function GET(req: NextRequest) {
  try {
    const stageSlug = req.nextUrl.searchParams.get("stage")
    const yearSlug = req.nextUrl.searchParams.get("year")

    const stage = stageSlug
      ? stageMap[stageSlug.toLowerCase()]
      : undefined

    const year = yearSlug
      ? yearMap[yearSlug.toLowerCase()]
      : undefined

    if (stageSlug && !stage) {
      return NextResponse.json(
        { error: "Invalid stage" },
        { status: 400 }
      )
    }

    if (yearSlug && !year) {
      return NextResponse.json(
        { error: "Invalid year" },
        { status: 400 }
      )
    }

    const subjects = await prisma.subject.findMany({
      where: {
        ...(stage && { stage }),
        ...(year && { year }),
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(subjects)
  } catch (error) {
    console.error("Failed to fetch subjects:", error)

    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    )
  }
}