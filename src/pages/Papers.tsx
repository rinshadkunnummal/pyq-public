import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  FileText,
  RefreshCw,
  ExternalLink,
  Download,
  Flag,
} from "lucide-react"

import { API_URL } from "../lib/api"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

type Paper = {
  id: string
  title: string
  examYear: number
  paperType: string
  pdfUrl: string
  fileSize?: number | null
  status: string
  reportCount: number
  subjectId: string
  uploaderName?: string | null
  createdAt?: string
  subject?: {
    id: string
    name: string
    code: string
    stage: string
    year: number
  }
  _reportedByMe?: boolean // Frontend-only tracking
}

const yearMap: Record<string, string> = {
  "first-year": "First Year",
  "second-year": "Second Year",
  "third-year": "Third Year",
  "fourth-year": "Fourth Year",
  "fifth-year": "Fifth Year",
}

const stageMap: Record<string, string> = {
  secondary: "Secondary",
  "senior-secondary": "Senior Secondary",
  degree: "Degree",
  pg: "PG",
}

export default function Papers() {
  const { stage, year, subject } = useParams()
  const navigate = useNavigate()

  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [reportingId, setReportingId] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState("")
  const [reportLoading, setReportLoading] = useState(false)
  const [reportError, setReportError] = useState("")

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reportingId) return

    setReportLoading(true)
    setReportError("")

    try {
      const res = await fetch(`${API_URL}/api/papers/${reportingId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reportReason.trim() || undefined }),
      })

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error("You have already reported this paper.")
        }
        throw new Error("Failed to report paper.")
      }

      setPapers((prev) =>
        prev.map((p) =>
          p.id === reportingId ? { ...p, _reportedByMe: true } : p
        )
      )
      setReportingId(null)
      setReportReason("")
    } catch (err) {
      setReportError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setReportLoading(false)
    }
  }

  const loadPapers = useCallback(async () => {
    if (!stage || !year || !subject) return

    setLoading(true)
    setError("")

    try {
      const yearNumber =
        year === "first-year"
          ? 1
          : year === "second-year"
            ? 2
            : year === "third-year"
              ? 3
              : year === "fourth-year"
                ? 4
                : year === "fifth-year"
                  ? 5
                  : Number(year)

      const params = new URLSearchParams({
        stage,
        year: String(yearNumber),
        subject,
      })

      const res = await fetch(`${API_URL}/api/papers?${params.toString()}`)

      if (!res.ok) {
        throw new Error("Unable to load papers.")
      }

      const data = await res.json()

      /*
       * Your API currently returns:
       *
       * [
       *   {...},
       *   {...}
       * ]
       *
       * So handle the array directly.
       *
       * This also supports { papers: [...] } in case
       * the API is changed later.
       */
      const result: Paper[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.papers)
          ? data.papers
          : []

      setPapers(result)
    } catch (err) {
      console.error("Failed to load papers:", err)
      setError("Unable to load papers.")
      setPapers([])
    } finally {
      setLoading(false)
    }
  }, [stage, year, subject])

  useEffect(() => {
    loadPapers()
  }, [loadPapers])

  const stageName = stageMap[stage || ""] || stage
  const yearName = yearMap[year || ""] || year

  /*
   * The API response already contains subject information.
   * Use it instead of trying to resolve the subject again.
   */
  const subjectName =
    papers[0]?.subject?.name ||
    "Subject"

  const subjectCode =
    papers[0]?.subject?.code || ""

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link
            to="/"
            className="hover:text-foreground transition-colors"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            to={`/stage/${stage}`}
            className="hover:text-foreground transition-colors"
          >
            {stageName}
          </Link>

          <span>/</span>

          <Link
            to={`/stage/${stage}/${year}`}
            className="hover:text-foreground transition-colors"
          >
            {yearName}
          </Link>

          <span>/</span>

          <span className="text-foreground font-medium">
            {subjectName}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {subjectName}
              </h1>

              <p className="mt-1 text-muted-foreground">
                {stageName} · {yearName}
                {subjectCode && ` · ${subjectCode}`}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={loadPapers}
            disabled={loading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>
        </div>

        <p className="mt-8 text-muted-foreground">
          Browse previous year question papers for this subject.
        </p>

        {/* Section */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Question Papers
            </h2>

            <p className="text-sm text-muted-foreground">
              {loading
                ? "Loading papers..."
                : `${papers.length} ${
                    papers.length === 1 ? "paper" : "papers"
                  } available`}
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-11 w-11 rounded-lg" />

                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-56" />
                        <Skeleton className="h-3 w-32" />
                      </div>

                      <Skeleton className="h-9 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <Card>
              <CardContent className="flex min-h-[280px] flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-xl border bg-muted p-4">
                  <FileText className="h-7 w-7 text-muted-foreground" />
                </div>

                <h3 className="font-semibold">
                  Unable to load papers
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {error}
                </p>

                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={loadPapers}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Empty */}
          {!loading && !error && papers.length === 0 && (
            <Card>
              <CardContent className="flex min-h-[280px] flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-xl border bg-muted p-4">
                  <FileText className="h-7 w-7 text-muted-foreground" />
                </div>

                <h3 className="font-semibold">
                  No papers available
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  There are no question papers for this subject yet.
                </p>

                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={() =>
                    navigate(`/stage/${stage}/${year}`)
                  }
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to subjects
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Papers */}
          {!loading && !error && papers.length > 0 && (
            <div className="space-y-3">
              {papers.map((paper) => (
                <Card
                  key={paper.id}
                  className="transition-shadow hover:shadow-sm"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border bg-muted">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div>
                          <h3 className="font-semibold">
                            {paper.title}
                          </h3>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span>{paper.examYear}</span>

                            <span>·</span>

                            <span>
                              {paper.paperType}
                            </span>

                            {paper.uploaderName && (
                              <>
                                <span>·</span>
                                <span>
                                  Uploaded by {paper.uploaderName}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Report paper"
                          onClick={() => setReportingId(paper.id)}
                          disabled={paper._reportedByMe}
                          className={paper._reportedByMe ? "text-destructive opacity-50" : "text-muted-foreground hover:text-destructive"}
                        >
                          <Flag className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() =>
                            window.open(
                              paper.pdfUrl,
                              "_blank",
                              "noopener,noreferrer"
                            )
                          }
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View
                        </Button>

                        <Button
                          onClick={() => {
                            window.open(
                              paper.pdfUrl,
                              "_blank",
                              "noopener,noreferrer"
                            )
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Open PDF
                        </Button>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Back */}
        <div className="mt-8">
          <Link
            to={`/stage/${stage}/${year}`}
            className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {yearName}
          </Link>
        </div>

        {/* Report Dialog */}
        <Dialog open={!!reportingId} onOpenChange={(open) => !open && setReportingId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report Paper</DialogTitle>
              <DialogDescription>
                Help keep the community clean. Let us know if this paper is inappropriate, low quality, or incorrect.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submitReport}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason (optional)</Label>
                  <Input
                    id="reason"
                    placeholder="e.g. Blurry scan, wrong subject"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                </div>
                {reportError && (
                  <p className="text-sm text-destructive">{reportError}</p>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setReportingId(null)} disabled={reportLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={reportLoading}>
                  {reportLoading ? "Reporting..." : "Submit Report"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}