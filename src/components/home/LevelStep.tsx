import { Button } from "../ui/button"
import { ChevronLeft } from "lucide-react"

const levelMap: Record<string, string[]> = {
  secondary: [
    "first-year",
    "second-year",
    "third-year",
    "fourth-year",
    "fifth-year",
  ],

  "senior-secondary": [
    "first-year",
    "second-year",
  ],

  degree: [
    "first-year",
    "second-year",
    "third-year",
  ],

  pg: [
    "first-year",
    "second-year",
  ],
}


interface Props {
  stage: string
  value: string | null
  onBack: () => void
  onSelect: (value: string) => void
}

export default function LevelStep({
  stage,
  value,
  onBack,
  onSelect,
}: Props) {
  const levels = levelMap[stage] ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>

        <div className="text-sm text-zinc-500 capitalize">
          {stage.replace(/-/g, " ")}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-zinc-900">
          Which level are you in?
        </h2>
        <p className="text-zinc-500 mt-2">
          Select your current class or year.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {levels.map((level) => {
          const active = value === level

          return (
            <button
              key={level}
              onClick={() => onSelect(level)}
              className={`rounded-2xl border p-6 text-center transition-all hover:shadow-md ${active
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 bg-white hover:border-zinc-300"
                }`}
            >
              <div className="text-lg font-semibold text-zinc-900 capitalize">
                {level.replace(/-/g, " ")}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}