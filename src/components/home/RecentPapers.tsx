import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"

export default function RecentPapers() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-900">Recent uploads</h2>
        <Button variant="outline">View all</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">2026</span>
                <span className="text-xs text-zinc-500">Board</span>
              </div>

              <div>
                <h3 className="font-medium text-zinc-900">English</h3>
                <p className="text-sm text-zinc-500">Secondary • Board Exam</p>
              </div>

              <Button variant="outline" className="w-full">
                Open PDF
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}