import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

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

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function matchesText(source: string, query: string) {
  const s = normalize(source)
  const q = normalize(query)

  if (q === "") return true

  if (s.includes(q)) return true

  const expanded = q
    .replace(/\bsen\b/g, "senior")
    .replace(/\bsec\b/g, "secondary")
    .replace(/\bsr\b/g, "senior")

  return s.includes(expanded)
}

function formatLabel(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function Papers() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchParams] = useSearchParams()

  const [query, setQuery] = useState("")
  const [stage, setStage] = useState(searchParams.get("stage") ?? "all")
  const [level, setLevel] = useState(searchParams.get("level") ?? "all")
  const [subject, setSubject] = useState(searchParams.get("subject") ?? "all")
  const [examType, setExamType] = useState(searchParams.get("examType") ?? "all")
  const [year, setYear] = useState(searchParams.get("year") ?? "all")

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/papers`)

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
  }, [])

  const approvedPapers = useMemo(
    () => papers.filter((p) => p.status === "approved"),
    [papers]
  )

  const stages = useMemo(
    () => Array.from(new Set(approvedPapers.map((p) => p.stage))).sort(),
    [approvedPapers]
  )

  const levels = useMemo(
    () => Array.from(new Set(approvedPapers.map((p) => p.level))).sort(),
    [approvedPapers]
  )

  const subjects = useMemo(
    () => Array.from(new Set(approvedPapers.map((p) => p.subject))).sort(),
    [approvedPapers]
  )

  const examTypes = useMemo(
    () => Array.from(new Set(approvedPapers.map((p) => p.examType))).sort(),
    [approvedPapers]
  )

  const years = useMemo(
    () =>
      Array.from(new Set(approvedPapers.map((p) => p.paperYear))).sort(
        (a, b) => b - a
      ),
    [approvedPapers]
  )

  const filteredPapers = useMemo(() => {
    return approvedPapers.filter((p) => {
      const matchesQuery =
        matchesText(p.subject, query) ||
        matchesText(p.examType, query) ||
        matchesText(p.level, query) ||
        matchesText(p.stage, query) ||
        String(p.paperYear).includes(query.trim())

      const matchesStage = stage === "all" || p.stage === stage
      const matchesLevel = level === "all" || p.level === level
      const matchesSubject = subject === "all" || p.subject === subject
      const matchesExamType = examType === "all" || p.examType === examType
      const matchesYear = year === "all" || String(p.paperYear) === year

      return (
        matchesQuery &&
        matchesStage &&
        matchesLevel &&
        matchesSubject &&
        matchesExamType &&
        matchesYear
      )
    })
  }, [approvedPapers, query, stage, level, subject, examType, year])

  const clearFilters = () => {
    setQuery("")
    setStage("all")
    setLevel("all")
    setSubject("all")
    setExamType("all")
    setYear("all")
  }

  return (
    <div className="space-y-6">
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
            : `${filteredPapers.length} paper${filteredPapers.length === 1 ? "" : "s"}`}
        </Badge>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search by subject, exam type, level, stage, or year..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-11"
          />
        </div>

        <Popover>
          <PopoverTrigger>
            <Button variant="outline" className="h-11 gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </PopoverTrigger>

          <PopoverContent align="end" className="w-80 p-0">
            <div className="p-4 pb-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-900">Filters</p>
                <p className="text-sm text-zinc-500">Refine papers</p>
              </div>

              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Separator />

            <div className="p-4 space-y-3">
              <Label className="text-xs uppercase text-zinc-500">Stage</Label>
              <RadioGroup value={stage} onValueChange={setStage}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="stage-all" />
                  <Label htmlFor="stage-all">All</Label>
                </div>
                {stages.map((s) => (
                  <div key={s} className="flex items-center space-x-2">
                    <RadioGroupItem value={s} id={`stage-${s}`} />
                    <Label htmlFor={`stage-${s}`}>{formatLabel(s)}</Label>
                  </div>
                ))}
              </RadioGroup>
              <Separator />
                <Label className="text-xs uppercase text-zinc-500">Level</Label>
                <RadioGroup value={level} onValueChange={setLevel}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="level-all" />
                    <Label htmlFor="level-all">All</Label>
                  </div>

                  {levels.map((l) => (
                    <div key={l} className="flex items-center space-x-2">
                      <RadioGroupItem value={l} id={`level-${l}`} />
                      <Label htmlFor={`level-${l}`}>{formatLabel(l)}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              <div className="p-4 space-y-3">
                <Label className="text-xs uppercase text-zinc-500">Subject</Label>
                <RadioGroup value={subject} onValueChange={setSubject}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="subject-all" />
                    <Label htmlFor="subject-all">All</Label>
                  </div>

                  {subjects.map((s) => (
                    <div key={s} className="flex items-center space-x-2">
                      <RadioGroupItem value={s} id={`subject-${s}`} />
                      <Label htmlFor={`subject-${s}`}>{s}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              <div className="p-4 space-y-3">
                <Label className="text-xs uppercase text-zinc-500">Exam Type</Label>
                <RadioGroup value={examType} onValueChange={setExamType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="exam-all" />
                    <Label htmlFor="exam-all">All</Label>
                  </div>

                  {examTypes.map((e) => (
                    <div key={e} className="flex items-center space-x-2">
                      <RadioGroupItem value={e} id={`exam-${e}`} />
                      <Label htmlFor={`exam-${e}`}>{e}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              <div className="p-4 space-y-3">
                <Label className="text-xs uppercase text-zinc-500">Year</Label>
                <RadioGroup value={year} onValueChange={setYear}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="year-all" />
                    <Label htmlFor="year-all">All</Label>
                  </div>

                  {years.map((y) => (
                    <div key={y} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(y)} id={`year-${y}`} />
                      <Label htmlFor={`year-${y}`}>{y}</Label>
                    </div>
                  ))}
                </RadioGroup>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap gap-2">
        {stage !== "all" && (
          <Badge variant="secondary" className="gap-1">
            {formatLabel(stage)}
            <button onClick={() => setStage("all")}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {level !== "all" && (
          <Badge variant="secondary" className="gap-1">
            {formatLabel(level)}
            <button onClick={() => setLevel("all")}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {(stage !== "all" ||
          level !== "all" ||
          subject !== "all" ||
          examType !== "all" ||
          year !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 px-2 text-zinc-500"
            >
              Clear all
            </Button>
          )}
      </div>

      {loading && <p className="text-sm text-zinc-500">Loading papers...</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && filteredPapers.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-4 h-10 w-10 text-zinc-400" />
            <h3 className="text-lg font-medium text-zinc-900">
              No papers found
            </h3>
            <p className="text-sm text-zinc-500 mt-1">
              Try adjusting your search or filters.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && filteredPapers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPapers.map((paper) => (
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