import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { API_URL } from "@/lib/api"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, ExternalLink, CheckCircle2, Clock3 } from "lucide-react"

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
  adminNote?: string | null
  createdAt: string
  approvedAt?: string | null
}

export default function AdminPapers() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/papers`)

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

  const filtered = useMemo(() => {
    const q = query.toLowerCase()

    return papers.filter((paper) => {
      return (
        paper.subject.toLowerCase().includes(q) ||
        paper.examType.toLowerCase().includes(q) ||
        String(paper.paperYear).includes(q) ||
        paper.level.toLowerCase().includes(q)
      )
    })
  }, [papers, query])

  const pendingCount = papers.filter((p) => p.status !== "approved").length
  const approvedCount = papers.filter((p) => p.status === "approved").length

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">All Papers</h1>
          <p className="text-sm text-muted-foreground">
            Review and manage all uploaded question papers.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total papers</CardDescription>
            <CardTitle className="text-2xl">{papers.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending review</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-orange-500" />
              {pendingCount}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              {approvedCount}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Papers</CardTitle>
              <CardDescription>
                Search by title, subject, or year.
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search papers..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Exam Type</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No papers found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((paper) => (
                  <TableRow key={paper.id}>
                    <TableCell>{paper.subject}</TableCell>
                    <TableCell>{paper.examType}</TableCell>
                    <TableCell>{paper.paperYear}</TableCell>

                    <TableCell>
                      {paper.status === "approved" ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Approved
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={paper.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View
                        </a>
                        {/* 
                        <Link
                          to={`/admin/papers/${paper.id}`}
                          className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                        >
                          Review
                        </Link> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}