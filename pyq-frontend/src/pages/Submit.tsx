import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import {
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
} from "lucide-react"

import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card"

const API =
  import.meta.env.VITE_API_URL ||
  "https://special-space-umbrella-v67vvq5prw5hpqjg-3000.app.github.dev"

type Subject = {
  id: string
  name: string
  code?: string | null
  stage: string
  year: number
}

const STAGES = [
  {
    value: "secondary",
    label: "Secondary",
  },
  {
    value: "senior-secondary",
    label: "Senior Secondary",
  },
  {
    value: "degree",
    label: "Degree",
  },
  {
    value: "pg",
    label: "Postgraduate",
  },
]

const YEARS = [
  {
    value: "1",
    label: "First Year",
  },
  {
    value: "2",
    label: "Second Year",
  },
  {
    value: "3",
    label: "Third Year",
  },
  {
    value: "4",
    label: "Fourth Year",
  },
  {
    value: "5",
    label: "Fifth Year",
  },
]

const PAPER_TYPES = [
  {
    value: "ANNUAL",
    label: "Annual Exam",
  },
  {
    value: "SEMESTER",
    label: "Semester Exam",
  },
  {
    value: "SUPPLEMENTARY",
    label: "Supplementary Exam",
  },
]

export default function Submit() {
  const navigate = useNavigate()

  const [stage, setStage] = useState("")
  const [year, setYear] = useState("")
  const [subjectId, setSubjectId] = useState("")

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(false)

  const [title, setTitle] = useState("")
  const [examYear, setExamYear] = useState(
    new Date().getFullYear().toString()
  )
  const [paperType, setPaperType] = useState("ANNUAL")

  const [uploaderName, setUploaderName] = useState("")
  const [uploaderEmail, setUploaderEmail] = useState("")

  const [file, setFile] = useState<File | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  /*
   * Load subjects whenever stage/year changes.
   */
  useEffect(() => {
    if (!stage || !year) {
      setSubjects([])
      setSubjectId("")
      return
    }

    async function loadSubjects() {
      setLoadingSubjects(true)
      setError(null)
      setSubjectId("")

      try {
        const params = new URLSearchParams({
          stage,
          year,
        })

        const res = await fetch(
          `${API}/api/admin/subjects?${params.toString()}`
        )

        const data = await res.json()

        if (!res.ok) {
          throw new Error(
            data?.error || "Unable to load subjects."
          )
        }

        setSubjects(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)

        setSubjects([])

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load subjects."
        )
      } finally {
        setLoadingSubjects(false)
      }
    }

    loadSubjects()
  }, [stage, year])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError(null)

    if (!subjectId) {
      setError("Please select a subject.")
      return
    }

    if (!file) {
      setError("Please attach a PDF file.")
      return
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.")
      return
    }

    if (!title.trim()) {
      setError("Please enter a paper title.")
      return
    }

    const parsedExamYear = Number(examYear)

    if (
      !Number.isInteger(parsedExamYear) ||
      parsedExamYear < 1900 ||
      parsedExamYear > 2100
    ) {
      setError("Please enter a valid exam year.")
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()

      /*
       * New Paper structure
       */
      formData.append("subjectId", subjectId)
      formData.append("title", title.trim())
      formData.append("examYear", String(parsedExamYear))
      formData.append("paperType", paperType)

      /*
       * Uploader information
       */
      formData.append("uploaderName", uploaderName.trim())

      if (uploaderEmail.trim()) {
        formData.append(
          "uploaderEmail",
          uploaderEmail.trim()
        )
      }

      /*
       * PDF
       */
      formData.append("file", file)

      const res = await fetch(
        `${API}/api/papers/submit`,
        {
          method: "POST",
          body: formData,
        }
      )

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Failed to submit paper."
        )
      }

      setSuccess(true)

      setTimeout(() => {
        navigate("/")
      }, 1800)
    } catch (err) {
      console.error("Paper submission failed:", err)

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while submitting the paper."
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-5 rounded-full bg-green-100 p-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>

            <h1 className="text-xl font-semibold">
              Paper submitted
            </h1>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Thanks for contributing to the archive. Your paper
              has been submitted for admin review.
            </p>

            <p className="mt-5 text-xs text-muted-foreground">
              Redirecting to home...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-xl border bg-muted p-3">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Submit a paper
            </h1>

            <p className="text-sm text-muted-foreground">
              Help build the previous year question paper archive.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Paper details
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Stage */}
            <div className="space-y-2">
              <Label htmlFor="stage">
                Stage
              </Label>

              <select
                id="stage"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">
                  Select stage
                </option>

                {STAGES.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div className="space-y-2">
              <Label htmlFor="year">
                Academic year
              </Label>

              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled={!stage}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">
                  Select year
                </option>

                {YEARS.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">
                Subject
              </Label>

              <select
                id="subject"
                value={subjectId}
                onChange={(e) =>
                  setSubjectId(e.target.value)
                }
                disabled={
                  !stage ||
                  !year ||
                  loadingSubjects
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">
                  {loadingSubjects
                    ? "Loading subjects..."
                    : !stage
                      ? "Select a stage first"
                      : !year
                        ? "Select an academic year first"
                        : subjects.length === 0
                          ? "No subjects available"
                          : "Select subject"}
                </option>

                {subjects.map((subject) => (
                  <option
                    key={subject.id}
                    value={subject.id}
                  >
                    {subject.name}
                    {subject.code
                      ? ` (${subject.code})`
                      : ""}
                  </option>
                ))}
              </select>

              {stage &&
                year &&
                !loadingSubjects &&
                subjects.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No subjects are available for this stage
                    and year.
                  </p>
                )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Paper title
              </Label>

              <Input
                id="title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="e.g. Hadith Annual Exam 2025"
                required
              />
            </div>

            {/* Exam year + paper type */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="examYear">
                  Exam year
                </Label>

                <Input
                  id="examYear"
                  type="number"
                  min="1900"
                  max="2100"
                  value={examYear}
                  onChange={(e) =>
                    setExamYear(e.target.value)
                  }
                  placeholder="2025"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paperType">
                  Paper type
                </Label>

                <select
                  id="paperType"
                  value={paperType}
                  onChange={(e) =>
                    setPaperType(e.target.value)
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  {PAPER_TYPES.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Uploader */}
            <div className="space-y-2">
              <Label htmlFor="uploaderName">
                Your name
              </Label>

              <Input
                id="uploaderName"
                value={uploaderName}
                onChange={(e) =>
                  setUploaderName(e.target.value)
                }
                placeholder="e.g. Rinshad"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uploaderEmail">
                Email
                <span className="ml-1 text-muted-foreground">
                  (optional)
                </span>
              </Label>

              <Input
                id="uploaderEmail"
                type="email"
                value={uploaderEmail}
                onChange={(e) =>
                  setUploaderEmail(e.target.value)
                }
                placeholder="you@example.com"
              />
            </div>

            {/* File */}
            <div className="space-y-2">
              <Label htmlFor="file">
                Question paper PDF
              </Label>

              <div className="rounded-lg border border-dashed p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-muted p-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <Input
                      id="file"
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={(e) =>
                        setFile(
                          e.target.files?.[0] ?? null
                        )
                      }
                      required
                      className="cursor-pointer"
                    />

                    <p className="mt-2 text-xs text-muted-foreground">
                      PDF files only.
                    </p>
                  </div>
                </div>

                {file && (
                  <div className="mt-3 rounded-md bg-muted px-3 py-2 text-sm">
                    <span className="font-medium">
                      Selected:
                    </span>{" "}
                    {file.name}
                  </div>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={
                submitting ||
                loadingSubjects ||
                subjects.length === 0
              }
              className="w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit paper
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Your submission will remain pending until an
              administrator approves it.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}