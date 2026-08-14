import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useDebounce } from "use-debounce"

import { API_URL } from "../../lib/api"

import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover"
import {
  RadioGroup,
  RadioGroupItem,
} from "../../components/ui/radio-group"
import { Label } from "../../components/ui/label"
import { Separator } from "../../components/ui/separator"

import {
  Search,
  Filter,
  X,
  FileText,
  ArrowUpDown,
} from "lucide-react"

import PaperCard from "../../components/PaperCard"

interface Paper {
  id: string
  stage: string
  level: string
  subject: string
  examType: string
  paperYear: number
  pdfUrl: string
  uploaderName: string
  status: string
}

function formatLabel(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\\s+/g, " ")
    .trim()
    .replace(/\\b\\w/g, (c) => c.toUpperCase())
}

export default function Papers() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState(searchParams.get("query") ?? "")
  const [stage, setStage] = useState(searchParams.get("stage") ?? "all")
  const [level, setLevel] = useState(searchParams.get("level") ?? "all")
  const [subject, setSubject] = useState(searchParams.get("subject") ?? "all")
  const [examType, setExamType] = useState(searchParams.get("examType") ?? "all")
  const [year, setYear] = useState(searchParams.get("year") ?? "all")
  const [sort, setSort] = useState(searchParams.get("sort") ?? "recent")

  const [debouncedQuery] = useDebounce(query, 300)

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()

        if (debouncedQuery) params.set("query", debouncedQuery)
        if (stage !== "all") params.set("stage", stage)
        if (level !== "all") params.set("level", level)
        if (subject !== "all") params.set("subject", subject)
        if (examType !== "all") params.set("examType", examType)
        if (year !== "all") params.set("year", year)
        if (sort !== "recent") params.set("sort", sort)

        setSearchParams(params)

        const res = await fetch(`${API_URL}/api/papers?${params.toString()}`)

        if (!res.ok) {
          throw new Error("Failed to load papers")
        }

        const data = await res.json()
        setPapers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchPapers()
  }, [
    debouncedQuery,
    stage,
    level,
    subject,
    examType,
    year,
    sort,
    setSearchParams,
  ])

  const stages = useMemo(
    () => Array.from(new Set(papers.map((p) => p.stage))).sort(),
    [papers]
  )

  const levels = useMemo(
    () => Array.from(new Set(papers.map((p) => p.level))).sort(),
    [papers]
  )

  const subjects = useMemo(
    () => Array.from(new Set(papers.map((p) => p.subject))).sort(),
    [papers]
  )

  const examTypes = useMemo(
    () => Array.from(new Set(papers.map((p) => p.examType))).sort(),
    [papers]
  )

  const years = useMemo(
    () =>
      Array.from(new Set(papers.map((p) => p.paperYear))).sort(
        (a, b) => b - a
      ),
    [papers]
  )

  const clearFilters = () => {
    setQuery("")
    setStage("all")
    setLevel("all")
    setSubject("all")
    setExamType("all")
    setYear("all")
    setSort("recent")
  }

  const activeFilters = [
    stage !== "all" ? formatLabel(stage) : null,
    level !== "all" ? formatLabel(level) : null,
    subject !== "all" ? subject : null,
    examType !== "all" ? examType : null,
    year !== "all" ? year : null,
  ].filter(Boolean)

  return (
    <div className="space-y-6 min-h-[60vh]">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-7 w-7 text-zinc-700" />
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Question Papers
            </h1>
          </div>

          <p className="text-zinc-500">
            Browse approved previous year question papers.
          </p>
        </div>

        <Badge variant="secondary" className="w-fit px-3 py-1">
          {loading
            ? "Loading..."
            : `${papers.length} paper${papers.length === 1 ? "" : "s"}`}
        </Badge>
      </div>

      {/* Search + Actions */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

          <Input
            placeholder="Search by subject, exam type, level, stage, or year..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-11"
          />
        </div>

        <div className="flex gap-3">
          {/* Sort */}
          <Popover>
            <PopoverTrigger block ariaLabel="Sort papers">
              <Button variant="outline" className="h-11 gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-56 p-3">
              <RadioGroup value={sort} onValueChange={setSort}>
                {[
                  { value: "recent", label: "Newest first" },
                  { value: "oldest", label: "Oldest first" },
                  { value: "year-desc", label: "Year ↓" },
                  { value: "year-asc", label: "Year ↑" },
                  { value: "subject", label: "Subject A–Z" },
                ].map((item) => (
                  <div key={item.value} className="flex items-center space-x-2 py-2">
                    <RadioGroupItem value={item.value} id={item.value} />
                    <Label htmlFor={item.value}>{item.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </PopoverContent>
          </Popover>

          {/* Filters */}
          <Popover>
            <PopoverTrigger block ariaLabel="Filter papers">
              <Button variant="outline" className="h-11 gap-2">
                <Filter className="h-4 w-4" />
                Filter
                {activeFilters.length > 0 && (
                  <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1 text-[11px] font-medium text-white">
                    {activeFilters.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between p-4 pb-3">
                <div>
                  <p className="font-medium text-zinc-900">Filters</p>
                  <p className="text-sm text-zinc-500">Refine papers</p>
                </div>

                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Separator />

              <div className="max-h-[420px] overflow-y-auto p-4 space-y-5">
                {[
                  { label: "Stage", value: stage, set: setStage, items: stages },
                  { label: "Level", value: level, set: setLevel, items: levels },
                  { label: "Subject", value: subject, set: setSubject, items: subjects },
                  { label: "Exam Type", value: examType, set: setExamType, items: examTypes },
                  {
                    label: "Year",
                    value: year,
                    set: setYear,
                    items: years.map(String),
                  },
                ].map((group) => (
                  <div key={group.label} className="space-y-3">
                    <Label className="text-xs uppercase tracking-wide text-zinc-500">
                      {group.label}
                    </Label>

                    <RadioGroup value={group.value} onValueChange={group.set}>
                      <div className="flex items-center space-x-2 py-1">
                        <RadioGroupItem value="all" id={`${group.label}-all`} />
                        <Label htmlFor={`${group.label}-all`}>All</Label>
                      </div>

                      {group.items.map((item) => (
                        <div key={item} className="flex items-center space-x-2 py-1">
                          <RadioGroupItem
                            value={item}
                            id={`${group.label}-${item}`}
                          />
                          <Label htmlFor={`${group.label}-${item}`}>
                            {group.label === "Year" ? item : formatLabel(item)}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    {group.label !== "Year" && <Separator />}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((chip) => (
            <Badge key={chip} variant="secondary" className="gap-1">
              {chip}
            </Badge>
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 px-2 text-zinc-500"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* States */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-44 animate-pulse border-zinc-200 bg-zinc-50" />
          ))}
        </div>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-sm text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && papers.length === 0 && (
        <Card className="border-dashed border-zinc-200">
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <FileText className="mb-4 h-10 w-10 text-zinc-400" />
            <h3 className="text-lg font-medium text-zinc-900">
              No papers found
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Try adjusting your search or filters.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {!loading && papers.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {papers.map((paper) => (
            <PaperCard
              key={paper.id}
              subject={paper.subject}
              stage={paper.stage}
              level={paper.level}
              examType={paper.examType}
              paperYear={paper.paperYear}
              pdfUrl={paper.pdfUrl}
            />
          ))}
        </div>
      )}
    </div>
  )
}