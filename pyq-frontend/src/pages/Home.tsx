import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  FileText,
  Search,
  Upload,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const resources = [
  {
    title: "Degree Papers",
    description:
      "Explore previous year papers from degree programmes.",
    href: "/papers?stage=degree",
    icon: BookOpen,
    action: "Explore",
  },
  {
    title: "Full Archive",
    description:
      "Search and filter the complete collection of approved papers.",
    href: "/papers",
    icon: FileText,
    action: "View archive",
  },
  {
    title: "Contribute",
    description:
      "Have a previous year paper? Add it to the archive.",
    href: "/upload",
    icon: Upload,
    action: "Upload a paper",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-zinc-100">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#27272A] bg-[#0A0A0A]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Button
            variant="ghost"
            asChild
            className="h-auto px-0 text-lg font-semibold tracking-tight text-white hover:bg-transparent hover:text-zinc-300"
          >
            <Link href="/">PYQ</Link>
          </Button>

          <nav className="flex items-center gap-1">
            <Button
              variant="ghost"
              asChild
              className="text-zinc-400 hover:bg-[#111111] hover:text-white"
            >
              <Link href="/papers">Papers</Link>
            </Button>

            <Button
              variant="ghost"
              asChild
              className="text-zinc-400 hover:bg-[#111111] hover:text-white"
            >
              <Link href="/upload">Upload</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#27272A]">
        {/* Ambient background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-zinc-400/[0.035] blur-3xl"
        />

        <div className="relative mx-auto max-w-5xl px-6 py-28 text-center sm:py-36">
          <Badge
            variant="outline"
            className="border-[#27272A] bg-[#111111] px-3 py-1.5 text-zinc-400"
          >
            <BookOpen className="mr-2 size-3.5" />
            Previous Year Papers
          </Badge>

          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            Your papers.
            <br />
            <span className="text-zinc-500">One archive.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            Find previous year question papers by stage, level, subject,
            and year. Everything you need to prepare, in one place.
          </p>

          {/* Search */}
          <div className="mx-auto mt-10 flex max-w-2xl items-center gap-2 rounded-xl border border-[#27272A] bg-[#111111] p-2 shadow-2xl shadow-black/20">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-zinc-500" />

              <Input
                type="search"
                placeholder="Search papers, subjects, or years..."
                className="h-11 border-0 bg-transparent pl-10 text-white shadow-none placeholder:text-zinc-600 focus-visible:ring-0"
              />
            </div>

            <Button
              asChild
              className="h-11 bg-zinc-100 text-zinc-950 hover:bg-white"
            >
              <Link href="/papers">
                Search
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>

          {/* Hero actions */}
          <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Button
              variant="outline"
              asChild
              className="border-[#27272A] bg-[#111111] text-zinc-300 hover:bg-[#151515] hover:text-white"
            >
              <Link href="/papers">
                <FileText className="mr-2 size-4" />
                Browse papers
              </Link>
            </Button>

            <Button
              variant="ghost"
              asChild
              className="text-zinc-500 hover:bg-transparent hover:text-white"
            >
              <Link href="/upload">
                <Upload className="mr-2 size-4" />
                Contribute a paper
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Explore */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="mb-10">
            <Badge
              variant="secondary"
              className="border-0 bg-transparent px-0 text-[11px] uppercase tracking-[0.18em] text-zinc-600"
            >
              Explore
            </Badge>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Find what you need
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
              Browse the archive or contribute papers to help build a
              better collection for everyone.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {resources.map((resource) => {
              const Icon = resource.icon

              return (
                <Card
                  key={resource.title}
                  className="group border-[#27272A] bg-[#111111] transition-colors hover:bg-[#151515]"
                >
                  <CardHeader>
                    <div className="flex size-10 items-center justify-center rounded-lg border border-[#27272A] bg-[#0A0A0A] text-zinc-400">
                      <Icon className="size-4" />
                    </div>

                    <CardTitle className="pt-3 text-base font-medium text-white">
                      {resource.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm leading-6 text-zinc-500">
                      {resource.description}
                    </p>

                    <Button
                      variant="link"
                      asChild
                      className="mt-4 h-auto p-0 text-zinc-400 hover:text-white"
                    >
                      <Link href={resource.href}>
                        {resource.action}
                        <ArrowRight className="ml-2 size-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <Separator className="bg-[#27272A]" />

      {/* Footer */}
      <footer>
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <span>PYQ Archive</span>
          <span>Previous year papers, organized.</span>
        </div>
      </footer>
    </main>
  )
}
