import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
  School,
  University,
} from "lucide-react"

import Breadcrumbs from "../components/Breadcrumbs"
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

export default function Stages() {
  const { stage: stageSlug } = useParams()

  const stage = STAGES.find((item) => item.slug === stageSlug)

  // Invalid stage
  if (!stage) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Not Found" },
            ]}
          />

          <div className="mt-10 rounded-2xl border border-dashed p-10 text-center">
            <h1 className="text-xl font-semibold">
              Stage not found
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              The academic stage you are looking for does not exist.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const Icon =
    stageIcons[stage.slug as keyof typeof stageIcons]

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">

        {/* Breadcrumb */}
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: formatLabel(stage.slug) },
          ]}
        />

        {/* Header */}
        <div className="mt-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="rounded-xl border bg-muted p-3">
              <Icon className="h-7 w-7 text-muted-foreground" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {formatLabel(stage.slug)}
              </h1>

              <p className="mt-2 text-muted-foreground">
                Select a year to browse subjects and previous year
                question papers.
              </p>
            </div>
          </div>
        </div>

        {/* Years */}
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            Select year
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose your academic year.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stage.yearSlugs.map((year, index) => (
            <Link
              key={year}
              to={`/stage/${stage.slug}/${year}`}
              className="group"
            >
              <Card className="h-full border-border transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border bg-muted text-sm font-semibold text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          {formatLabel(year)}
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Browse subjects
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Back */}
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to stages
          </Link>
        </div>
      </div>
    </div>
  )
}
