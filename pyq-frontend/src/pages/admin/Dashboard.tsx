import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  FileClock,
  CheckCircle2,
  Download,
  Users,
  ArrowRight,
  Upload,
} from "lucide-react"

import { API_URL } from "../../lib/api"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"

interface Paper {
  id: string
  stage: string
  level: string
  subject: string
  examType: string
  paperYear: number
  uploaderName: string
  status: "pending" | "approved"
  downloads?: number
  createdAt: string
}

function formatLabel(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function AdminDashboard() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/papers`)
        if (!res.ok) throw new Error()

        const data = await res.json()
        setPapers(data)
      } catch {
        // silent fail for dashboard
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const stats = useMemo(() => {
    const pending = papers.filter((p) => p.status === "pending")
    const approved = papers.filter((p) => p.status === "approved")

    return {
      total: papers.length,
      pending: pending.length,
      approved: approved.length,
      downloads: papers.reduce((sum, p) => sum + (p.downloads ?? 0), 0),
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
      title: "Pending review",
      value: stats.pending,
      icon: FileClock,
      color: "text-amber-600",
      bg: "bg-amber-100",
      href: "/admin/pending",
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-100",
      href: "/admin/approved",
    },
    {
      title: "Total papers",
      value: stats.total,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
      href: "/admin/papers",
    },
    {
      title: "Downloads",
      value: stats.downloads.toLocaleString(),
      icon: Download,
      color: "text-violet-600",
      bg: "bg-violet-100",
      href: "/admin/papers",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-zinc-500">
            Review submissions and manage the paper library.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/admin/pending"
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Review pending
          </Link>

          <Link
            to="/submit"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
          >
            <Upload className="h-4 w-4" />
            Upload
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon

          return (
            <Link key={stat.title} to={stat.href}>
              <Card className="rounded-3xl border-zinc-200 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-zinc-500">{stat.title}</p>
                      <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
                        {loading ? "—" : stat.value}
                      </p>
                    </div>

                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.bg}`}>
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
        <Card className="rounded-3xl border-zinc-200 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Recent submissions</CardTitle>
              <p className="text-sm text-zinc-500 mt-1">
                Latest uploaded papers
              </p>
            </div>

            <Link
              to="/admin/papers"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900 inline-flex items-center gap-1"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>

          <CardContent className="space-y-4">
            {loading && (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-2xl bg-zinc-100 animate-pulse" />
                ))}
              </div>
            )}

            {!loading && recentPapers.length === 0 && (
              <div className="rounded-2xl border border-dashed border-zinc-200 p-10 text-center">
                <p className="text-sm text-zinc-500">No submissions yet.</p>
              </div>
            )}

            {!loading &&
              recentPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="flex items-center justify-between rounded-2xl border border-zinc-200 p-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-zinc-900 truncate">
                        {paper.subject}
                      </p>

                      {paper.status === "approved" ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Approved
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </div>

                    <p className="text-sm text-zinc-500">
                      {formatLabel(paper.stage)} • {formatLabel(paper.level)} • {paper.paperYear}
                    </p>

                    <p className="text-xs text-zinc-400 mt-1">
                      by {paper.uploaderName}
                    </p>
                  </div>

                  <Link
                    to={`/admin/papers/${paper.id}`}
                    className="ml-4 inline-flex h-9 items-center justify-center rounded-md border border-zinc-200 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    Review
                  </Link>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card className="rounded-3xl border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <p className="text-sm text-zinc-500 mt-1">
              Common admin tasks
            </p>
          </CardHeader>

          <CardContent className="space-y-3">
            <Link
              to="/admin/pending"
              className="flex items-center justify-between rounded-2xl border border-zinc-200 p-4 hover:bg-zinc-50"
            >
              <div>
                <p className="font-medium text-zinc-900">Review pending</p>
                <p className="text-sm text-zinc-500">
                  {stats.pending} awaiting approval
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-400" />
            </Link>

            <Link
              to="/admin/approved"
              className="flex items-center justify-between rounded-2xl border border-zinc-200 p-4 hover:bg-zinc-50"
            >
              <div>
                <p className="font-medium text-zinc-900">Approved papers</p>
                <p className="text-sm text-zinc-500">
                  Browse approved library
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-400" />
            </Link>

            <Link
              to="/admin/papers"
              className="flex items-center justify-between rounded-2xl border border-zinc-200 p-4 hover:bg-zinc-50"
            >
              <div>
                <p className="font-medium text-zinc-900">All papers</p>
                <p className="text-sm text-zinc-500">
                  Search and manage papers
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-400" />
            </Link>

            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="font-medium text-zinc-900">Library health</p>
              <p className="text-sm text-zinc-500 mt-1">
                {stats.total === 0
                  ? "No papers available yet."
                  : `${Math.round((stats.approved / Math.max(stats.total, 1)) * 100)}% of submissions are approved.`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}