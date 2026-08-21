import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "../ui/card"
import { GraduationCap, Calendar, FileText, Sparkles } from "lucide-react"

const items = [
  {
    label: "Board Exam",
    desc: "Final board papers",
    icon: GraduationCap,
    query: "examType=Board",
  },
  {
    label: "Half Yearly",
    desc: "Mid-year exams",
    icon: Calendar,
    query: "examType=Half-Yearly",
  },
  {
    label: "Model Exam",
    desc: "Practice papers",
    icon: FileText,
    query: "examType=Model",
  },
  {
    label: "Recent",
    desc: "New uploads",
    icon: Sparkles,
    query: "",
  },
]

export default function QuickFilters() {
  const navigate = useNavigate()

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-zinc-900">Quick access</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <Card
              key={item.label}
              className="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md"
              onClick={() =>
                navigate(`/papers${item.query ? `?${item.query}` : ""}`)
              }
            >
              <CardContent className="p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                  <Icon className="h-5 w-5 text-zinc-700" />
                </div>

                <h3 className="font-medium text-zinc-900">{item.label}</h3>
                <p className="mt-1 text-sm text-zinc-500">{item.desc}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}