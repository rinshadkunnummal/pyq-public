import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { API_URL } from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Eye, Loader2 } from "lucide-react"

interface Paper {
  id: string
  stage: string
  level: string
  subject: string
  examType: string
  paperYear: number
  pdfUrl: string
  uploaderName: string
  status: "pending" | "approved"
}

export default function AdminPending() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [approvingId, setApprovingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/papers/pending`)

        if (!res.ok) {
          throw new Error("Failed to load pending papers")
        }

        const data = await res.json()
        setPapers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchPending()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      setApprovingId(id)

      const res = await fetch(`${API_URL}/api/admin/papers/${id}/approve`, {
        method: "POST",
      })

      if (!res.ok) {
        throw new Error("Failed to approve paper")
      }

      // Remove approved paper from pending list
      setPapers((prev) => prev.filter((paper) => paper.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setApprovingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Pending submissions
          </h1>
          <p className="text-sm text-muted-foreground">
            {loading
              ? "Loading..."
              : `${papers.length} paper${papers.length === 1 ? "" : "s"} awaiting review`}
          </p>
        </div>

        <Badge variant="secondary">Pending</Badge>
      </div>

      {loading && (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-72 animate-pulse rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && papers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="mb-4 h-10 w-10 text-green-600" />
            <h3 className="text-lg font-medium">All caught up</h3>
            <p className="text-sm text-muted-foreground mt-1">
              No papers are waiting for review.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && papers.length > 0 && (
        <div className="grid gap-4">
          {papers.map((paper) => (
            <Card key={paper.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{paper.subject}</CardTitle>
                    <p className="text-sm text-muted-foreground capitalize">
                      {paper.examType}
                    </p>
                  </div>

                  <Badge variant="secondary">Pending</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-muted-foreground">Stage</p>
                    <p className="font-medium capitalize">{paper.stage}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Level</p>
                    <p className="font-medium capitalize">
                      {paper.level.replace(/-/g, " ")}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Year</p>
                    <p className="font-medium">{paper.paperYear}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Uploaded by</p>
                    <p className="font-medium">{paper.uploaderName}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={paper.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View PDF
                  </a>

                  <Button
                    onClick={() => handleApprove(paper.id)}
                    disabled={approvingId === paper.id}
                    className="inline-flex items-center"
                  >
                    {approvingId === paper.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve
                      </>
                    )}
                  </Button>

                  <Link
                    to={`/admin/papers/${paper.id}`}
                    className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Review
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}