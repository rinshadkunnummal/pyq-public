import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  CheckCircle2,
  Files,
  ArrowRight,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import Breadcrumbs from '../../components/Breadcrumbs'
import { API_URL } from '../../lib/api'

type Paper = {
  id: string
  title: string
  examYear: number
  paperType: string
  reportCount: number
  createdAt: string
  subject?: {
    id: string
    code: string
    name: string
    stage: string
    year: number
  }
}

export default function Dashboard() {
  const [totalPapers, setTotalPapers] = useState(0)
  const [reportedPapers, setReportedPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [papersRes, reportedRes] = await Promise.all([
          fetch(`${API_URL}/api/papers`),
          fetch(`${API_URL}/api/admin/papers/reported`, { credentials: 'include' })
        ])
        
        if (papersRes.ok) {
          const papersData = await papersRes.json()
          const arr = Array.isArray(papersData) ? papersData : Array.isArray(papersData.papers) ? papersData.papers : []
          setTotalPapers(arr.length)
        }

        if (reportedRes.ok) {
          const reportedData = await reportedRes.json()
          const arr = Array.isArray(reportedData) ? reportedData : Array.isArray(reportedData.papers) ? reportedData.papers : []
          setReportedPapers(arr)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const stats = useMemo(() => {
    return {
      total: totalPapers,
      reported: reportedPapers.length,
      clean: Math.max(0, totalPapers - reportedPapers.length)
    }
  }, [totalPapers, reportedPapers])

  const recentReported = useMemo(
    () =>
      [...reportedPapers]
        .sort((a, b) => b.reportCount - a.reportCount)
        .slice(0, 5),
    [reportedPapers]
  )

  const statCards = [
    {
      title: 'Reported papers',
      value: stats.reported,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-100',
      href: '/admin/reported',
    },
    {
      title: 'Clean papers',
      value: stats.clean,
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-100',
      href: '/admin/papers',
    },
    {
      title: 'Total papers',
      value: stats.total,
      icon: Files,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
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
            Review community reports and manage the paper library.
          </p>
        </div>

        <div className="flex gap-3">
          <Link to="/admin/reported" className="inline-flex items-center text-sm font-medium hover:underline">
            Review reports
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              <CardTitle>Highly reported</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Papers with the most community reports
              </p>
            </div>

            <Link
              to="/admin/reported"
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

            {!loading && recentReported.length === 0 && (
              <div className="rounded-2xl border border-dashed p-10 text-center">
                <p className="text-sm text-muted-foreground">
                  No reported papers.
                </p>
              </div>
            )}

            {!loading &&
              recentReported.map((paper) => (
                <div
                  key={paper.id}
                  className="flex items-center justify-between rounded-2xl border p-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <p className="truncate font-medium">
                        {paper.title}
                      </p>
                      <Badge variant="destructive">{paper.reportCount} reports</Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {paper.subject?.name} • {paper.subject?.stage} • {paper.examYear}
                    </p>
                  </div>

                  <Link to="/admin/reported" className="text-sm font-medium text-blue-600 hover:underline">
                    Review
                  </Link>
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
              to="/admin/reported"
              className="flex items-center justify-between rounded-2xl border p-4 hover:bg-muted/50"
            >
              <div>
                <p className="font-medium">Review reports</p>
                <p className="text-sm text-muted-foreground">
                  {stats.reported} reported papers
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <Link
              to="/admin/papers"
              className="flex items-center justify-between rounded-2xl border p-4 hover:bg-muted/50"
            >
              <div>
                <p className="font-medium">All papers</p>
                <p className="text-sm text-muted-foreground">
                  Browse library
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
