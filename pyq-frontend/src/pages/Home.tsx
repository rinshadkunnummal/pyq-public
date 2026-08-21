import { Link } from "react-router-dom"
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  School,
  University,
} from "lucide-react"

import { Card, CardContent } from "../components/ui/card"
import { STAGES } from "../lib/stages"

const stageIcons = {
  secondary: School,
  "senior-secondary": GraduationCap,
  degree: University,
  pg: BookOpen,
}

function formatLabel(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            Previous Year Questions
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Question Bank
          </h1>

          <p className="mt-3 text-muted-foreground">
            Browse previous year question papers by stage, year, and subject.
          </p>
        </div>

        {/* Stages */}
        <div className="grid gap-4 sm:grid-cols-2">
          {STAGES.map((stage) => {
            const Icon =
              stageIcons[stage.slug as keyof typeof stageIcons]

            return (
              <Link
                key={stage.slug}
                to={`/stage/${stage.slug}`}
                className="group"
              >
                <Card className="h-full border-border transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-xl border bg-muted p-3 transition-colors group-hover:bg-primary/10">
                          <Icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                        </div>

                        <div>
                          <h2 className="font-semibold">
                            {formatLabel(stage.slug)}
                          </h2>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {stage.years} years available
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="mt-1 h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {stage.yearSlugs.map((year) => (
                        <span
                          key={year}
                          className="rounded-md border bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground"
                        >
                          {formatLabel(year)}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
