import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileClock,
  CheckCircle2,
  Files,
  Download,
  ArrowRight,
  Upload,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
// import { Button } from '../../components/ui/button'
import Breadcrumbs from '../../components/Breadcrumbs'

type Paper = {
  id: string
  title: string
  examYear: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  subject?: {
    code: string
    name: string
    classLevel?: {
      name: string
      examType?: {
        name: string
      }
    }
  }
}

const API = ''

export default function Dashboard() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/admin/papers`)
        if (!res.ok) throw new Error()

        const data = await res.json()
        setPapers(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const stats = useMemo(() => {
    const pending = papers.filter((p) => p.status === 'PENDING')
    const approved = papers.filter((p) => p.status === 'APPROVED')

    return {
      total: papers.length,
      pending: pending.length,
      approved: approved.length,
    }
  }, [papers])

  const recentPapers = useMemo(
    () =>
      [...papers]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
        .slice(0, 5),
    [papers]
  )

  const statCards = [
    {
      title: 'Pending review',
      value: stats.pending,
      icon: FileClock,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
      href: '/admin/pending',
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-100',
      href: '/admin/approved',
    },
    {
      title: 'Total papers',
      value: stats.total,
      icon: Files,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      href: '/admin/papers',
    },
    {
      title: 'Downloads',
      value: '—',
      icon: Download,
      color: 'text-violet-600',
      bg: 'bg-violet-100',
      href: '/admin/papers',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Dashboard' },
          ]}
        />
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review submissions and manage the paper library.
          </p>
        </div>

        <div className="flex gap-3">
          <a >
            <Link to="/admin/pending">Review pending</Link>
          </a>

          <a >
            <Link to="/admin/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Link>
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon

          return (
            <Link key={stat.title} to={stat.href}>
              <Card className="transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="mt-2 text-3xl font-bold tracking-tight">
                        {loading ? '—' : stat.value}
                      </p>
                    </div>

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.bg}`}
                    >
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent submissions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Recent submissions</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Latest uploaded papers
              </p>
            </div>

            <Link
              to="/admin/papers"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>

          <CardContent className="space-y-4">
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-2xl bg-muted"
                />
              ))}

            {!loading && recentPapers.length === 0 && (
              <div className="rounded-2xl border border-dashed p-10 text-center">
                <p className="text-sm text-muted-foreground">
                  No submissions yet.
                </p>
              </div>
            )}

            {!loading &&
              recentPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="flex items-center justify-between rounded-2xl border p-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <p className="truncate font-medium">
                        {paper.title}
                      </p>

                      {paper.status === 'APPROVED' ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Approved
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {paper.subject?.classLevel?.examType?.name} • Class{' '}
                      {paper.subject?.classLevel?.name} •{' '}
                      {paper.subject?.code} • {paper.examYear}
                    </p>
                  </div>

                  <a >
                    <Link to="/admin/pending">Review</Link>
                  </a>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Common admin tasks
            </p>
          </CardHeader>

          <CardContent className="space-y-3">
            <Link
              to="/admin/pending"
              className="flex items-center justify-between rounded-2xl border p-4 hover:bg-muted/50"
            >
              <div>
                <p className="font-medium">Review pending</p>
                <p className="text-sm text-muted-foreground">
                  {stats.pending} awaiting approval
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <Link
              to="/admin/approved"
              className="flex items-center justify-between rounded-2xl border p-4 hover:bg-muted/50"
            >
              <div>
                <p className="font-medium">Approved papers</p>
                <p className="text-sm text-muted-foreground">
                  Browse approved library
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <Link
              to="/admin/upload"
              className="flex items-center justify-between rounded-2xl border p-4 hover:bg-muted/50"
            >
              <div>
                <p className="font-medium">Upload paper</p>
                <p className="text-sm text-muted-foreground">
                  Add a new question paper
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <div className="rounded-2xl bg-muted p-4">
              <p className="font-medium">Library health</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stats.total === 0
                  ? 'No papers available yet.'
                  : `${Math.round(
                      (stats.approved / Math.max(stats.total, 1)) * 100
                    )}% of submissions are approved.`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}