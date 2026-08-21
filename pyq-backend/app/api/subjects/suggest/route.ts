import { NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"
import { Stage } from "@prisma/client"

const stageMap: Record<string, Stage> = {
  secondary: Stage.SECONDARY,
  "senior-secondary": Stage.SENIOR_SECONDARY,
  degree: Stage.DEGREE,
  pg: Stage.PG,
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.name || !body.stage || body.year === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, stage, year" },
        { status: 400 }
      )
    }

    const stageValue = stageMap[String(body.stage).toLowerCase()]

    if (!stageValue) {
      return NextResponse.json(
        { error: "Invalid stage" },
        { status: 400 }
      )
    }

    const suggestion = await prisma.subjectSuggestion.create({
      data: {
        name: body.name,
        stage: stageValue,
        year: Number(body.year),
        suggestedBy: body.suggestedBy ?? null,
      },
    })

    return NextResponse.json(suggestion, { status: 201 })
  } catch (error) {
    console.error("Failed to create subject suggestion:", error)

    return NextResponse.json(
      { error: "Failed to create suggestion" },
      { status: 500 }
    )
  }
}