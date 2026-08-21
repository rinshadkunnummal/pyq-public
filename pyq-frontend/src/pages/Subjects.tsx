import { useCallback, useEffect, useState } from "react"
import { ArrowLeft, ArrowRight, Folder, RefreshCw } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
} from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"

type Subject = {
  id: string
  name: string
  slug: string
  stage: string
  year: number
}

const API =
  import.meta.env.VITE_API_URL ||
  "https://special-space-umbrella-v67vvq5prw5hpqjg-3000.app.github.dev"

const STAGE_LABELS: Record<string, string> = {
  secondary: "Secondary",
  "senior-secondary": "Senior Secondary",
  degree: "Degree",
  pg: "PG",
}

const YEAR_LABELS: Record<string, string> = {
  "1": "First Year",
  "2": "Second Year",
  "3": "Third Year",
  "4": "Fourth Year",
  "5": "Fifth Year",
}

function getStageLabel(stage: string) {
  return (
    STAGE_LABELS[stage.toLowerCase()] ||
    stage.replace(/-/g, " ")
  )
}

function getYearLabel(year: string) {
  return YEAR_LABELS[year] || `Year ${year}`
}

export default function Subjects() {
  const { stage = "", year = "" } = useParams<{
    stage: string
    year: string
  }>()

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const stageLabel = getStageLabel(stage)
  const yearLabel = getYearLabel(year)

  const loadSubjects = useCallback(async () => {
    if (!stage || !year) return

    try {
      setLoading(true)
      setError("")

      const url =
        `${API}/api/admin/subjects` +
        `?stage=${encodeURIComponent(stage)}` +
        `&year=${encodeURIComponent(year)}`

      const res = await fetch(url)

      if (!res.ok) {
        let message = "Unable to load subjects."

        try {
          const data = await res.json()

          if (data?.error) {
            message = data.error
          }
        } catch {
          // Ignore invalid JSON response
        }

        throw new Error(message)
      }

      const data = await res.json()

      if (!Array.isArray(data)) {
        throw new Error("Invalid subjects response.")
      }

      setSubjects(data)
    } catch (error) {
      console.error("Failed to load subjects:", error)

      setSubjects([])

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load subjects."
      )
    } finally {
      setLoading(false)
    }
  }, [stage, year])

  useEffect(() => {
    loadSubjects()
  }, [loadSubjects])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">

        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link
            to="/"
            className="transition-colors hover:text-foreground"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            to={`/stage/${stage}`}
            className="capitalize transition-colors hover:text-foreground"
          >
            {stageLabel}
          </Link>

          <span>/</span>

          <span className="font-medium text-foreground">
            {yearLabel}
          </span>
        </div>

        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">

            <div className="rounded-xl border bg-muted p-3">
              <Folder className="h-6 w-6 text-muted-foreground" />
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stageLabel}
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight">
                {yearLabel}
              </h1>

              <p className="mt-2 max-w-xl text-muted-foreground">
                Select a subject to browse previous year question
                papers.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={loadSubjects}
            disabled={loading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""
                }`}
            />
            Refresh
          </Button>
        </div>

        {/* Subjects section */}
        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Subjects
              </h2>

              {!loading && !error && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {subjects.length}{" "}
                  {subjects.length === 1
                    ? "subject"
                    : "subjects"}{" "}
                  available
                </p>
              )}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-xl" />

                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>

                      <Skeleton className="h-5 w-5 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <Card>
              <CardContent className="flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 rounded-xl border bg-muted p-4">
                  <Folder className="h-6 w-6 text-muted-foreground" />
                </div>

                <h3 className="font-semibold">
                  Unable to load subjects
                </h3>

                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  {error}
                </p>

                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={loadSubjects}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Empty */}
          {!loading && !error && subjects.length === 0 && (
            <Card>
              <CardContent className="flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 rounded-xl border bg-muted p-4">
                  <Folder className="h-6 w-6 text-muted-foreground" />
                </div>

                <h3 className="font-semibold">
                  No subjects yet
                </h3>

                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  There are currently no subjects available
                  for {yearLabel.toLowerCase()}.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Subjects */}
          {!loading && !error && subjects.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <Link
                  key={subject.id}
                  to={`/stage/${stage}/${year}/${subject.id}`}
                  className="group"
                >
                  <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="shrink-0 rounded-xl border bg-muted p-3 transition-colors group-hover:bg-primary/10">
                          <Folder className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold">
                            {subject.name}
                          </h3>

                          <p className="mt-1 text-sm text-muted-foreground">
                            View question papers
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="ml-4 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Back */}
        <div className="mt-8">
          <Link to={`/stage/${stage}`}>
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {stageLabel}
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}