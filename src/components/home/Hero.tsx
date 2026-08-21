import { Link } from "react-router-dom"
import { ArrowRight, Search, Upload } from "lucide-react"

import { Badge } from "../ui/badge"

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border bg-white px-6 py-16 shadow-sm sm:px-10 sm:py-20">
      {/* background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(24,24,27,0.06),transparent_40%)]" />

      <div className="relative mx-auto max-w-3xl text-center">
        <Badge variant="secondary" className="mb-5">
          Previous year question papers
        </Badge>

        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
          Find the right paper, faster.
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
          Browse approved question papers by stage, level, subject, exam type,
          and year. Download instantly and prepare with confidence.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/papers"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            <Search className="h-4 w-4" />
            Browse papers
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            to="/submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
          >
            <Upload className="h-4 w-4" />
            Upload a paper
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-500">
          <span className="rounded-full bg-zinc-100 px-3 py-1">Secondary</span>
          <span className="rounded-full bg-zinc-100 px-3 py-1">Senior Secondary</span>
          <span className="rounded-full bg-zinc-100 px-3 py-1">Degree</span>
          <span className="rounded-full bg-zinc-100 px-3 py-1">PG</span>
        </div>
      </div>
    </section>
  )
}