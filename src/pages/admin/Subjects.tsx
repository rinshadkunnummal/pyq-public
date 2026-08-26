import { useState, useEffect } from "react"
import { API_URL } from "../../lib/api"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { BookOpen, CheckCircle2, Loader2, Plus } from "lucide-react"

const STAGES = [
  { value: "secondary", label: "Secondary" },
  { value: "senior-secondary", label: "Senior Secondary" },
  { value: "degree", label: "Degree" },
  { value: "pg", label: "Postgraduate" },
]

const STAGE_YEAR_COUNT: Record<string, number> = {
  secondary: 5,
  "senior-secondary": 2,
  degree: 3,
  pg: 2,
}

const YEAR_LABELS = [
  "First Year",
  "Second Year",
  "Third Year",
  "Fourth Year",
  "Fifth Year",
]

export default function SubjectsAdmin() {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [stage, setStage] = useState("")
  const [year, setYear] = useState("")
  
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const yearOptions = stage
    ? Array.from({ length: STAGE_YEAR_COUNT[stage] ?? 0 }, (_, i) => ({
        value: String(i + 1),
        label: YEAR_LABELS[i],
      }))
    : []

  useEffect(() => {
    setYear("")
  }, [stage])

  async function createSubject() {
    setError(null)
    setSuccessMsg(null)

    if (!name.trim() || !stage || !year) {
      setError("Please fill in all required fields.")
      return
    }

    try {
      setCreating(true)

      const response = await fetch(`${API_URL}/api/subjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim() || undefined,
          stage,
          year: Number(year),
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Failed to create subject")
      }

      setSuccessMsg(`Subject "${name}" created successfully!`)
      setName("")
      setCode("")
      // Keep stage and year selected for faster bulk entry
    } catch (err) {
      console.error("Failed to create subject:", err)
      setError(err instanceof Error ? err.message : "Failed to create subject")
    } finally {
      setCreating(false)
    }
  }

  const isValid = name.trim() && stage && year

  return (
    <div className="space-y-6 p-6 pb-20 max-w-2xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Manage Subjects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add new academic subjects to the global catalog.
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b bg-zinc-50/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Create Subject</CardTitle>
              <CardDescription className="mt-1">
                Fill in the details below. This will be instantly available to all users.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="stage" className="text-sm font-medium">Stage</Label>
              <select
                id="stage"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              >
                <option value="">Select stage</option>
                {STAGES.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="year" className="text-sm font-medium">Academic Year</Label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled={!stage}
                className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              >
                <option value="">{stage ? "Select year" : "Select a stage first"}</option>
                {yearOptions.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-medium">Subject Name</Label>
            <Input
              id="name"
              placeholder="e.g. Linear Algebra"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl shadow-sm focus-visible:ring-indigo-500"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="code" className="text-sm font-medium">Subject Code <span className="font-normal text-muted-foreground">(Optional)</span></Label>
            <Input
              id="code"
              placeholder="e.g. MAT201"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="h-11 rounded-xl shadow-sm focus-visible:ring-indigo-500"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-5 py-4 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              {successMsg}
            </div>
          )}

          <Button
            onClick={createSubject}
            disabled={!isValid || creating}
            size="lg"
            className="w-full h-12 rounded-xl text-base font-semibold shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            {creating ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating...</>
            ) : (
              <><Plus className="mr-2 h-5 w-5" /> Create Subject</>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
