import { NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"

export async function GET() {
  try {
    const approvedCount = await prisma.paper.count({
      where: { status: "approved" },
    })

    const subjects = await prisma.paper.findMany({
      where: { status: "approved" },
      distinct: ["subject"],
      select: { subject: true },
    })

    const levels = await prisma.paper.findMany({
      where: { status: "approved" },
      distinct: ["stage", "level"],
      select: { stage: true, level: true },
    })

    const years = await prisma.paper.findMany({
      where: { status: "approved" },
      select: { paperYear: true },
    })

    const yearValues = years.map((y) => y.paperYear)

    return NextResponse.json({
      approved: approvedCount,
      subjects: subjects.length,
      levels: levels.length,
      minYear: yearValues.length ? Math.min(...yearValues) : null,
      maxYear: yearValues.length ? Math.max(...yearValues) : null,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}