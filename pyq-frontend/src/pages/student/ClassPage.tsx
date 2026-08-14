import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Folder } from "lucide-react"

import { Card, CardContent } from "../../components/ui/card"
import { Skeleton } from "../../components/ui/skeleton"

type ClassLevel = {
  id: string
  name: string
  slug: string
}

const API = import.meta.env.VITE_API_URL || "https://special-space-umbrella-v67vvq5prw5hpqjg-3000.app.github.dev"

export default function ClassPage() {
  const { exam } = useParams()

  const [classes, setClasses] = useState<ClassLevel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/admin/classes?exam=${exam}`)
        const data = await res.json()
        setClasses(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [exam])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight capitalize">
              {exam?.replace("-", " ")}
            </h1>
            <p className="text-muted-foreground mt-2">
              Select a class to browse subjects.
            </p>
          </div>

          <a>
            <Link to="/">Back</Link>
          </a>
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
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <Link
                key={cls.id}
                to={`/exam/${exam}/${cls.slug}`}
                className="group"
              >
                <Card className="transition-all hover:border-primary hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg border bg-muted p-3 transition-colors group-hover:bg-primary/10">
                        <Folder className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                      </div>

                      <div>
                        <h2 className="font-semibold">{cls.name}</h2>
                        <p className="text-sm text-muted-foreground">
                          Open class
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