import { useEffect, useMemo, useState } from "react"
import { API_URL } from "../../lib/api"
import { Button } from "../../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import { Search, ExternalLink, Trash2, Files, Loader2 } from "lucide-react"

interface Paper {
  id: string
  title: string
  examYear: number
  paperType: string
  pdfUrl: string
  reportCount: number
  createdAt: string
  subject?: {
    name: string
    stage: string
    year: number
  }
}

export default function AdminPapers() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)

  const fetchPapers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/papers`)
      if (!res.ok) throw new Error("Failed to load papers")
      
      const data = await res.json()
      // handle either array or { papers: [] }
      const papersArray = Array.isArray(data) ? data : Array.isArray(data.papers) ? data.papers : []
      setPapers(papersArray)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPapers()
  }, [])

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map(p => p.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const handleBulkRemove = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Are you sure you want to permanently delete ${selectedIds.size} papers?`)) return

    setBulkLoading(true)
    try {
      const promises = Array.from(selectedIds).map(id =>
        fetch(`${API_URL}/api/admin/papers/${id}/remove`, {
          method: "POST",
          credentials: "include"
        })
      )
      await Promise.allSettled(promises)
      setPapers(prev => prev.filter(p => !selectedIds.has(p.id)))
      setSelectedIds(new Set())
    } finally {
      setBulkLoading(false)
    }
  }

  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this paper?")) return

    setRemovingId(id)
    try {
      const res = await fetch(`${API_URL}/api/admin/papers/${id}/remove`, {
        method: "POST",
        credentials: "include"
      })

      if (!res.ok) throw new Error("Failed to remove paper")
      
      // Remove from local state
      setPapers(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to remove paper")
    } finally {
      setRemovingId(null)
    }
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return papers.filter((paper) => {
      return (
        paper.title.toLowerCase().includes(q) ||
        paper.subject?.name.toLowerCase().includes(q) ||
        paper.paperType.toLowerCase().includes(q) ||
        String(paper.examYear).includes(q)
      )
    })
  }, [papers, query])

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-[400px] animate-pulse rounded-xl bg-muted" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="m-6 border-destructive/20 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-destructive mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 p-6 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all active question papers in the system.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Papers</CardTitle>
            <Files className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{papers.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="gap-4 border-b bg-zinc-50/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-4">
                <CardTitle>All Papers</CardTitle>
                {selectedIds.size > 0 && (
                  <Button variant="destructive" size="sm" onClick={handleBulkRemove} disabled={bulkLoading}>
                    {bulkLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Delete Selected ({selectedIds.size})
                  </Button>
                )}
              </div>
              <CardDescription>
                Search by title, subject, or year.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search library..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 h-10 rounded-xl"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50/50 hover:bg-zinc-50/50">
                  <TableHead className="w-12">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={filtered.length > 0 && selectedIds.size === filtered.length} onChange={toggleSelectAll} />
                  </TableHead>
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Subject</TableHead>
                  <TableHead className="font-semibold">Exam Type</TableHead>
                  <TableHead className="font-semibold">Year</TableHead>
                  <TableHead className="font-semibold">Reports</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No papers found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((paper) => (
                    <TableRow key={paper.id} className="hover:bg-zinc-50/50">
                      <TableCell>
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={selectedIds.has(paper.id)} onChange={() => toggleSelect(paper.id)} />
                      </TableCell>
                      <TableCell className="font-medium text-zinc-900">{paper.title}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-700">{paper.subject?.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {paper.subject?.stage} • Yr {paper.subject?.year}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-white">
                          {paper.paperType.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{paper.examYear}</TableCell>
                      <TableCell>
                        {paper.reportCount > 0 ? (
                          <Badge variant="destructive" className="font-semibold">
                            {paper.reportCount}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">0</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={paper.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-9 items-center justify-center rounded-md border bg-white px-3 text-sm font-medium hover:bg-zinc-100 transition-colors"
                          >
                            <ExternalLink className="mr-2 h-3.5 w-3.5" />
                            View
                          </a>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-9 px-3"
                            disabled={removingId === paper.id}
                            onClick={() => handleRemove(paper.id)}
                          >
                            {removingId === paper.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
