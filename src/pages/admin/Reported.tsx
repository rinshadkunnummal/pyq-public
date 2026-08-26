import { useEffect, useState } from 'react'
import { AlertTriangle, Check, CheckCircle2, Trash2, ExternalLink, Loader2 } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import Breadcrumbs from '../../components/Breadcrumbs'
import { API_URL } from '../../lib/api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'

type Report = {
  id: string
  reason: string
  createdAt: string
  ipHash: string
}

type Paper = {
  id: string
  title: string
  examYear: number
  paperType: string
  pdfUrl: string
  reportCount: number
  reports: Report[]
  subject?: {
    id: string
    code: string
    name: string
    stage: string
    year: number
  }
}

export default function ReportedPapers() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog states
  const [dismissingId, setDismissingId] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)

  useEffect(() => {
    fetchReported()
  }, [])

  const fetchReported = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/admin/papers/reported`, { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to load reported papers')
      
      const data = await res.json()
      setPapers(Array.isArray(data) ? data : Array.isArray(data.papers) ? data.papers : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = async () => {
    if (!dismissingId) return
    setActionLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/admin/papers/${dismissingId}/dismiss`, {
        method: 'POST',
        credentials: 'include'
      })
      if (!res.ok) throw new Error('Failed to dismiss reports')
      
      setPapers((prev) => prev.filter((p) => p.id !== dismissingId))
      setDismissingId(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRemove = async () => {
    if (!removingId) return
    setActionLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/admin/papers/${removingId}/remove`, {
        method: 'POST',
        credentials: 'include'
      })
      if (!res.ok) throw new Error('Failed to remove paper')
      
      setPapers((prev) => prev.filter((p) => p.id !== removingId))
      setRemovingId(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setActionLoading(false)
    }
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === papers.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(papers.map(p => p.id)))
  }

  const handleBulkAction = async (action: 'dismiss' | 'remove') => {
    if (selectedIds.size === 0) return
    if (!confirm(`Are you sure you want to ${action} ${selectedIds.size} selected papers?`)) return

    setBulkLoading(true)
    try {
      const promises = Array.from(selectedIds).map(id =>
        fetch(`${API_URL}/api/admin/papers/${id}/${action}`, {
          method: 'POST',
          credentials: 'include'
        })
      )
      await Promise.allSettled(promises)
      setPapers(prev => prev.filter(p => !selectedIds.has(p.id)))
      setSelectedIds(new Set())
    } finally {
      setBulkLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Reported papers' },
          ]}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reported papers</h1>
          <p className="mt-2 text-muted-foreground">
            {loading ? 'Loading...' : `${papers.length} paper${papers.length === 1 ? '' : 's'} reported by the community`}
          </p>
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 bg-zinc-50 p-2 rounded-lg border shadow-sm">
            <span className="text-sm font-medium px-2 text-muted-foreground">{selectedIds.size} selected</span>
            <Button variant="secondary" size="sm" onClick={() => handleBulkAction('dismiss')} disabled={bulkLoading}>
              {bulkLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
              Dismiss
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleBulkAction('remove')} disabled={bulkLoading}>
              {bulkLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete
            </Button>
          </div>
        )}
      </div>

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
              No reported papers need your attention.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {!loading && !error && papers.length > 0 && (
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer px-1 w-fit">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={selectedIds.size === papers.length} onChange={toggleSelectAll} />
            Select All
          </label>
        )}
        {papers.map((paper) => (
          <Card key={paper.id} className="border-red-100 shadow-sm relative">
            <div className="absolute top-4 right-4 z-10">
              <input type="checkbox" className="h-5 w-5 rounded border-gray-300" checked={selectedIds.has(paper.id)} onChange={() => toggleSelect(paper.id)} />
            </div>
            <CardHeader className="bg-red-50/50 pb-4 pr-12">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    {paper.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {paper.subject?.name} • {paper.examYear} • {paper.paperType.replace(/_/g, ' ')}
                  </p>
                </div>
                <Badge variant="destructive">{paper.reportCount} reports</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-3">Report Reasons</h4>
                <div className="space-y-2">
                  {paper.reports?.map((report, i) => (
                    <div key={report.id || i} className="text-sm bg-muted rounded-md p-3">
                      <span className="font-medium">User {report.ipHash.slice(0, 8)}:</span> {report.reason || 'No reason provided'}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View PDF
                  </Button>
                </a>
                
                <Button variant="secondary" onClick={() => setDismissingId(paper.id)}>
                  <Check className="mr-2 h-4 w-4" />
                  Dismiss Reports
                </Button>
                
                <Button variant="destructive" onClick={() => setRemovingId(paper.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Paper
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dismiss Dialog */}
      <Dialog open={!!dismissingId} onOpenChange={(open) => !open && setDismissingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dismiss Reports?</DialogTitle>
            <DialogDescription>
              This will clear all reports for this paper. The paper will remain visible to the public.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDismissingId(null)} disabled={actionLoading}>Cancel</Button>
            <Button onClick={handleDismiss} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirm Dismiss'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Dialog */}
      <Dialog open={!!removingId} onOpenChange={(open) => !open && setRemovingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Paper?</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this paper? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemovingId(null)} disabled={actionLoading}>Cancel</Button>
            <Button variant="destructive" onClick={handleRemove} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete Paper'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
// Add CheckCircle2 to lucide imports manually if missing, I will do it now:
// wait, I imported AlertTriangle, Check, Trash2, ExternalLink, Loader2. Let me fix the imports.
