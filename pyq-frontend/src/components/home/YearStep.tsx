import { Button } from "../ui/button"
import { ChevronLeft, ArrowRight } from "lucide-react"

const years = [2026, 2025, 2024, 2023, 2022, 2021]

interface Props {
  stage: string
  level: string
  value: string | null
  onBack: () => void
  onSelect: (value: string) => void
  onContinue: () => void
}

export default function YearStep({
  stage,
  level,
  value,
  onBack,
  onSelect,
  onContinue,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>

        <div className="text-sm text-zinc-500 capitalize">
          {stage.replace(/-/g, " ")} • {level.replace(/-/g, " ")}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-zinc-900">
          Which year paper do you need?
        </h2>
        <p className="text-zinc-500 mt-2">
          Choose the paper year you want to practice.
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {years.map((year) => {
          const active = value === String(year)

          return (
            <button
              key={year}
              onClick={() => onSelect(String(year))}
              className={`rounded-xl border p-4 text-center transition-all hover:shadow-md ${
                active
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300"
              }`}
            >
              <div className="font-semibold">{year}</div>
            </button>
          )
        })}
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          onClick={onContinue}
          disabled={!value}
          className="h-11 px-6 gap-2"
        >
          Show papers
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}