import { Link } from "react-router-dom"
import { FileQuestion, ArrowLeft, Home } from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-16 bg-background">
      <Card className="w-full max-w-lg border-border bg-card/80 backdrop-blur">
        <CardContent className="flex flex-col items-center text-center gap-6 p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-muted/40">
            <FileQuestion className="h-8 w-8 text-muted-foreground" />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium tracking-[0.3em] text-muted-foreground uppercase">
              Error 404
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Page not found
            </h1>

            <p className="text-muted-foreground leading-relaxed max-w-md">
              The page you are looking for doesn't exist, may have been moved,
              or the link may be incorrect.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button className="min-w-[160px]">
              <Link to="/" className="flex items-center justify-center">
                <Home className="mr-2 h-4 w-4" />
                Go home
              </Link>
            </Button>


            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="min-w-[160px]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back
            </Button>
          </div>

          <div className="pt-2 text-xs text-muted-foreground">
            Sparq Papers · Previous Year Question Archive
          </div>
        </CardContent>
      </Card>
    </main>
  )
}