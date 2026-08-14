import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FileText, Download, Eye } from 'lucide-react'

import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Skeleton } from '../../components/ui/skeleton'

type Paper = {
  id: string
  title: string
  examYear: number
  pdfUrl: string
  fileSize?: number | null
}

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function PaperPage() {
  const { exam, class: classSlug, subject } = useParams()

  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `${API}/api/papers?exam=${exam}&class=${classSlug}&subject=${subject}`
        )

        const data = await res.json()
        setPapers(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [exam, classSlug, subject])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <Link
                to={`/exam/${exam}`}
                className="capitalize hover:text-foreground"
              >
                {exam?.replace('-', ' ')}
              </Link>
              <span>/</span>
              <Link
                to={`/exam/${exam}/${classSlug}`}
                className="hover:text-foreground"
              >
                Class {classSlug}
              </Link>
              <span>/</span>
              <span className="text-foreground">{subject}</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              {subject} Papers
            </h1>
            <p className="mt-2 text-muted-foreground">
              Browse and download approved question papers.
            </p>
          </div>

          <a>
            <Link to={`/exam/${exam}/${classSlug}`}>Back</Link>
          </a>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-20 rounded-md" />
                      <Skeleton className="h-9 w-24 rounded-md" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : papers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No papers available</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                No approved papers have been uploaded for {subject} in Class{' '}
                {classSlug} yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {papers.map((paper) => (
              <Card key={paper.id} className="transition-colors hover:border-primary">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg border bg-muted p-3">
                        <FileText className="h-6 w-6 text-red-500" />
                      </div>

                      <div>
                        <h2 className="font-semibold">{paper.title}</h2>
                        <p className="text-sm text-muted-foreground">
                          {paper.examYear} • PDF
                          {paper.fileSize
                            ? ` • ${(paper.fileSize / 1024 / 1024).toFixed(1)} MB`
                            : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(paper.pdfUrl, '_blank')}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => window.open(paper.pdfUrl, '_blank')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}