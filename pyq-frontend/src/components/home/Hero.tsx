import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"

import StageStep from "./StageStep"
import LevelStep from "./LevelStep"
import YearStep from "./YearStep"

export default function Hero() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [stage, setStage] = useState<string | null>(null)
  const [level, setLevel] = useState<string | null>(null)
  const [year, setYear] = useState<string | null>(null)

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100

  const handleContinue = () => {
    const params = new URLSearchParams()

    if (stage) params.set("stage", stage)
    if (level) params.set("level", level)
    if (year) params.set("year", year)

    navigate(`/papers?${params.toString()}`)
  }

  return (
    <section className="mx-auto max-w-4xl px-4">
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-4">
          Guided paper finder
        </Badge>

        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Find the right paper in three quick steps
        </h1>

        <p className="mt-4 text-zinc-500 text-lg">
          Choose your stage, level, and paper year. No typing required.
        </p>
      </div>

      <Card className="p-6 sm:p-8 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline">Step {step} of 3</Badge>
          <span className="text-sm text-zinc-500">{progress}%</span>
        </div>

        <Progress value={progress} className="mb-8" />

        {step === 1 && (
          <StageStep
            value={stage}
            onSelect={(value) => {
              setStage(value)
              setLevel(null)
              setYear(null)
              setStep(2)
            }}
          />
        )}

        {step === 2 && stage && (
          <LevelStep
            stage={stage}
            value={level}
            onBack={() => setStep(1)}
            onSelect={(value) => {
              setLevel(value)
              setYear(null)
              setStep(3)
            }}
          />
        )}

        {step === 3 && stage && level && (
          <YearStep
            stage={stage}
            level={level}
            value={year}
            onBack={() => setStep(2)}
            onSelect={setYear}
            onContinue={handleContinue}
          />
        )}
      </Card>
    </section>
  )
}