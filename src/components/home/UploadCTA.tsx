import { Link } from "react-router-dom"
import { ArrowRight, Upload, Sparkles } from "lucide-react"

import { Badge } from "../ui/badge"

export default function UploadCTA() {
  return (
    <section className="relative overflow-hidden rounded-3xl border bg-white px-6 py-12 shadow-sm sm:px-10">
      {/* background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(24,24,27,0.06),transparent_40%)]" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <Badge variant="secondary" className="mb-4 gap-1">
            <Sparkles className="h-3 w-3" />
            Help the community
          </Badge>

          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Can’t find a paper?
          </h2>

          <p className="mt-4 text-base leading-7 text-zinc-600">
            Upload missing question papers for your class or subject and help
            other students prepare better. Every contribution makes the library
            more useful for everyone.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
          <Link
            to="/submit"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            <Upload className="h-4 w-4" />
            Upload a paper
          </Link>

          <Link
            to="/papers"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
          >
            Browse all papers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}