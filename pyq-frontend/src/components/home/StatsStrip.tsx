import { Card, CardContent } from "../ui/card"

const stats = [
  { label: "Approved papers", value: "1,240+" },
  { label: "Subjects", value: "42" },
  { label: "Levels", value: "8" },
  { label: "Year range", value: "2020–2026" },
]

export default function StatsStrip() {
  return (
    <Card>
      <CardContent className="grid gap-6 p-6 text-center sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
            <p className="text-sm text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}