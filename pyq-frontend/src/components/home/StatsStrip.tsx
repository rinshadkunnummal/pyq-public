import { useEffect, useMemo, useState } from "react"
import { FileText, BookOpen, Layers3, CalendarRange } from "lucide-react"

import { Card, CardContent } from "../ui/card"
import { API_URL } from "../../lib/api"

interface Paper {
  id: string
  stage: string
  level: string
  subject: string
  examType: string
  paperYear: number
  status: string
}

export default function StatsStrip() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/papers`)
        if (!res.ok) return

        const data: Paper[] = await res.json()
        setPapers(data)
      } catch {
        // fail silently
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const stats = useMemo(() => {
    const approved = papers.filter((p) => p.status === "approved")

    const subjects = new Set(approved.map((p) => p.subject))
    const levels = new Set(
      approved.map((p) => `${p.stage}-${p.level}`)
    )

    const years = approved.map((p) => p.paperYear)
    const minYear = years.length ? Math.min(...years) : null
    const maxYear = years.length ? Math.max(...years) : null

    return {
      approved: approved.length,
      subjects: subjects.size,
      levels: levels.size,
      yearRange:
        minYear && maxYear ? `${minYear}–${maxYear}` : "—",
    }
  }, [papers])

  const items = [
    {
      label: "Approved papers",
      value: loading ? "—" : stats.approved.toLocaleString(),
      icon: FileText,
    },
    {
      label: "Subjects",
      value: loading ? "—" : stats.subjects.toString(),
      icon: BookOpen,
    },
    {
      label: "Levels",
      value: loading ? "—" : stats.levels.toString(),
      icon: Layers3,
    },
    {
      label: "Year range",
      value: loading ? "—" : stats.yearRange,
      icon: CalendarRange,
    },
  ]

  return (
    <Card className="rounded-3xl border-zinc-200 shadow-sm">
      <CardContent className="grid gap-6 p-6 text-center sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <div key={item.label} className="flex flex-col items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100">
                <Icon className="h-5 w-5 text-zinc-700" />
              </div>

              <div className="space-y-1">
                <p className="text-2xl font-bold tracking-tight text-zinc-900">
                  {item.value}
                </p>
                <p className="text-sm text-zinc-500">
                  {item.label}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}