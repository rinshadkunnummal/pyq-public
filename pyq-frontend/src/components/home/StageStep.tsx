import { BookOpen, GraduationCap, Library, Award } from "lucide-react"

const stages = [
  {
    value: "secondary",
    label: "Secondary",
    desc: "Five-year secondary program",
    icon: BookOpen,
  },
  {
    value: "senior-secondary",
    label: "Senior Secondary",
    desc: "Advanced secondary studies",
    icon: GraduationCap,
  },
  {
    value: "degree",
    label: "Degree",
    desc: "Undergraduate program",
    icon: Library,
  },
  {
    value: "pg",
    label: "PG",
    desc: "Postgraduate program",
    icon: Award,
  },
]

interface Props {
  value: string | null
  onSelect: (value: string) => void
}

export default function StageStep({ value, onSelect }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-zinc-900">
          Which stage are you in?
        </h2>
        <p className="text-zinc-500 mt-2">
          Choose the stage that matches your current studies.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stages.map((stage) => {
          const Icon = stage.icon
          const active = value === stage.value

          return (
            <button
              key={stage.value}
              onClick={() => onSelect(stage.value)}
              className={`rounded-2xl border p-5 text-left transition-all hover:shadow-md ${
                active
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 bg-white hover:border-zinc-300"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-zinc-700" />
              </div>

              <h3 className="font-semibold text-zinc-900">{stage.label}</h3>
              <p className="text-sm text-zinc-500 mt-1">{stage.desc}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}