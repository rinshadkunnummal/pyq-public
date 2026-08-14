import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Folder } from "lucide-react"
import Breadcrumbs from '../../components/Breadcrumbs'

import { Card, CardContent } from "../../components/ui/card"
import { Skeleton } from "../../components/ui/skeleton"

type Subject = {
  id: string
  name: string
  code: string
}

const API = import.meta.env.VITE_API_URL || "http://localhost:3000"

export default function SubjectPage() {
  const { exam, class: classSlug } = useParams()

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `${API}/api/admin/subjects?exam=${exam}&class=${classSlug}`
        )
        const data = await res.json()
        setSubjects(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [exam, classSlug])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                {
                  label: exam?.replace('-', ' ') || '',
                  href: `/exam/${exam}`,
                },
                { label: `Class ${classSlug}` },
              ]}
            />

            <h1 className="text-3xl font-bold tracking-tight">
              Class {classSlug}
            </h1>

            <p className="mt-2 text-muted-foreground">
              Select a subject to view papers.
            </p>
          </div>

          <Link to={`/exam/${exam}`}>Back</Link>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                to={`/exam/${exam}/${classSlug}/${subject.code}`}
                className="group"
              >
                <Card className="transition-all hover:border-primary hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg border bg-muted p-3 transition-colors group-hover:bg-primary/10">
                        <Folder className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                      </div>

                      <div>
                        <h2 className="font-semibold">{subject.code}</h2>
                        <p className="text-sm text-muted-foreground">
                          {subject.name}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}