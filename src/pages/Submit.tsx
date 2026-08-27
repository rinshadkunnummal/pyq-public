import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import {
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
  BookOpen,
  User,
  PlusCircle,
  CloudUpload,
} from "lucide-react"
import { upload } from "@vercel/blob/client"

import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { API_URL } from "../lib/api"

type Subject = {
  id: string
  name: string
  code?: string | null
  stage: string
  year: number
}

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

const PAPER_TYPES = [
  { value: "ANNUAL", label: "Annual Exam" },
  { value: "HALF_YEARLY", label: "Half Yearly Exam" },
  { value: "DEGREE_FIRST_SEMESTER", label: "Degree First Semester" },
  { value: "DEGREE_SECOND_SEMESTER", label: "Degree Second Semester" },
  { value: "DEGREE_THIRD_SEMESTER", label: "Degree Third Semester" },
  { value: "DEGREE_FOURTH_SEMESTER", label: "Degree Fourth Semester" },
  { value: "DEGREE_FIFTH_SEMESTER", label: "Degree Fifth Semester" },
  { value: "DEGREE_SIXTH_SEMESTER", label: "Degree Sixth Semester" },
  { value: "PG_FIRST_SEMESTER", label: "PG First Semester" },
  { value: "PG_SECOND_SEMESTER", label: "PG Second Semester" },
  { value: "PG_THIRD_SEMESTER", label: "PG Third Semester" },
  { value: "PG_FOURTH_SEMESTER", label: "PG Fourth Semester" },
]

export default function Submit() {
  const navigate = useNavigate()

  // Form State
  const [stage, setStage] = useState("")
  const [year, setYear] = useState("")
  const [subjectId, setSubjectId] = useState("")
  const [title, setTitle] = useState("")
  const [examYear, setExamYear] = useState(new Date().getFullYear().toString())
  const [paperType, setPaperType] = useState("ANNUAL")
  const [uploaderName, setUploaderName] = useState("")
  const [uploaderEmail, setUploaderEmail] = useState("")
  const [file, setFile] = useState<File | null>(null)

  // System State
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Subject Creation State
  const [showSubjectDialog, setShowSubjectDialog] = useState(false)
  const [newSubjectName, setNewSubjectName] = useState("")
  const [newSubjectCode, setNewSubjectCode] = useState("")
  const [creatingSubject, setCreatingSubject] = useState(false)
  const [subjectError, setSubjectError] = useState<string | null>(null)

  const yearOptions = stage
    ? Array.from({ length: STAGE_YEAR_COUNT[stage] ?? 0 }, (_, i) => ({
        value: String(i + 1),
        label: YEAR_LABELS[i],
      }))
    : []

  // Reset year on stage change
  useEffect(() => {
    setYear("")
  }, [stage])

  // Load subjects
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
        const params = new URLSearchParams({ stage, year })
        const res = await fetch(`${API_URL}/api/subjects?${params.toString()}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data?.error || "Unable to load subjects.")
        }

        const subjectsArray = Array.isArray(data) ? data : (Array.isArray(data?.subjects) ? data.subjects : [])
        setSubjects(subjectsArray)
      } catch (err) {
        console.error(err)
        setSubjects([])
        setError(err instanceof Error ? err.message : "Unable to load subjects.")
      } finally {
        setLoadingSubjects(false)
      }
    }

    loadSubjects()
  }, [stage, year])

  const handleCreateSubject = async () => {
    setSubjectError(null)
    if (!newSubjectName.trim()) {
      setSubjectError("Please enter a subject name.")
      return
    }

    setCreatingSubject(true)
    try {
      const res = await fetch(`${API_URL}/api/subjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSubjectName.trim(),
          code: newSubjectCode.trim() || undefined,
          stage,
          year: Number(year),
        }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Failed to create subject.")
      }

      const newSubject = data.subject || data
      // Add to list and select it
      setSubjects((prev) => [...prev, newSubject])
      setSubjectId(newSubject.id)
      
      setShowSubjectDialog(false)
      setNewSubjectName("")
      setNewSubjectCode("")
    } catch (err) {
      console.error(err)
      setSubjectError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setCreatingSubject(false)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!subjectId) return setError("Please select a subject.")
    if (!file) return setError("Please attach a PDF file.")
    if (file.type !== "application/pdf") return setError("Only PDF files are allowed.")
    if (!title.trim()) return setError("Please enter a paper title.")

    const parsedExamYear = Number(examYear)
    if (!Number.isInteger(parsedExamYear) || parsedExamYear < 1900 || parsedExamYear > 2100) {
      return setError("Please enter a valid exam year.")
    }

    setSubmitting(true)

    try {
      // 1. Upload the file to Vercel Blob
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: `${API_URL}/api/upload/token`,
      })

      // 2. Send the metadata and the resulting URL to the backend
      const payload = {
        subjectId,
        title: title.trim(),
        examYear: parsedExamYear,
        paperType,
        uploaderName: uploaderName.trim(),
        uploaderEmail: uploaderEmail.trim() || undefined,
        pdfUrl: blob.url,
      }

      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Failed to submit paper.")
      }

      setSuccess(true)
      setTimeout(() => navigate("/"), 1800)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Something went wrong while submitting the paper.")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="mx-auto flex max-w-2xl min-h-[80vh] items-center justify-center px-4 py-12">
        <Card className="w-full border-green-100 shadow-xl shadow-green-500/5">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 animate-in zoom-in duration-500">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Paper Published Successfully!
            </h1>
            <p className="mt-3 max-w-md text-base text-muted-foreground">
              Thanks for contributing to the archive. Your paper is now live and available for everyone to see.
            </p>
            <p className="mt-8 flex items-center text-sm font-medium text-muted-foreground animate-pulse">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting to home...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 py-10">
      <div className="mx-auto max-w-3xl px-4">
        {/* Header */}
        <div className="mb-10 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200">
            <CloudUpload className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
            Contribute to the Archive
          </h1>
          <p className="text-lg text-muted-foreground">
            Share previous year question papers and help other students prepare better.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Academic Context */}
          <Card className="overflow-hidden border-zinc-200 shadow-sm transition-all hover:border-indigo-200/50 hover:shadow-md">
            <CardHeader className="border-b bg-zinc-50/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Academic Context</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Select the course and subject for this paper.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
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

              <div className="space-y-3 sm:col-span-2">
                <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    id="subject"
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    disabled={!stage || !year || loadingSubjects}
                    className="flex h-11 w-full flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
                      <option key={subject.id} value={subject.id}>
                        {subject.name} {subject.code ? `(${subject.code})` : ""}
                      </option>
                    ))}
                  </select>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowSubjectDialog(true)}
                    disabled={!stage || !year}
                    className="h-11 shrink-0 rounded-xl"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Subject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Paper Details */}
          <Card className="overflow-hidden border-zinc-200 shadow-sm transition-all hover:border-emerald-200/50 hover:shadow-md">
            <CardHeader className="border-b bg-zinc-50/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Paper Details</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Information about the specific exam.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
              <div className="space-y-3 sm:col-span-2">
                <Label htmlFor="title" className="text-sm font-medium">Paper Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modern Physics Final Exam 2024"
                  className="h-11 rounded-xl shadow-sm focus-visible:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="examYear" className="text-sm font-medium">Exam Year</Label>
                <Input
                  id="examYear"
                  type="number"
                  min="1900"
                  max="2100"
                  value={examYear}
                  onChange={(e) => setExamYear(e.target.value)}
                  className="h-11 rounded-xl shadow-sm focus-visible:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="paperType" className="text-sm font-medium">Paper Type</Label>
                <select
                  id="paperType"
                  value={paperType}
                  onChange={(e) => setPaperType(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                >
                  {PAPER_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Upload & Submit */}
          <Card className="overflow-hidden border-zinc-200 shadow-sm transition-all hover:border-purple-200/50 hover:shadow-md">
            <CardHeader className="border-b bg-zinc-50/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Upload & Credit</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Provide the PDF and get credit for your contribution.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="uploaderName" className="text-sm font-medium">Your Name</Label>
                <Input
                  id="uploaderName"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="h-11 rounded-xl shadow-sm focus-visible:ring-purple-500"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="uploaderEmail" className="text-sm font-medium">Email <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                <Input
                  id="uploaderEmail"
                  type="email"
                  value={uploaderEmail}
                  onChange={(e) => setUploaderEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="h-11 rounded-xl shadow-sm focus-visible:ring-purple-500"
                />
              </div>

              <div className="space-y-3 sm:col-span-2">
                <Label htmlFor="file" className="text-sm font-medium">Question Paper PDF</Label>
                <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 px-6 py-8 transition-colors hover:border-purple-400 hover:bg-purple-50/30">
                  <Input
                    id="file"
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0"
                    required
                  />
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-full bg-white p-3 shadow-sm ring-1 ring-zinc-200">
                      <FileText className="h-8 w-8 text-zinc-400" />
                    </div>
                    {file ? (
                      <div>
                        <p className="font-medium text-purple-700">{file.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-zinc-700">Click or drag PDF here</p>
                        <p className="text-sm text-muted-foreground mt-1">Maximum file size 10MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="sm:col-span-2 rounded-xl border border-destructive/20 bg-destructive/10 px-5 py-4 text-sm font-medium text-destructive">
                  {error}
                </div>
              )}

              <div className="sm:col-span-2 mt-4">
                <Button
                  type="submit"
                  disabled={submitting || loadingSubjects}
                  size="lg"
                  className="w-full h-14 rounded-xl text-base font-semibold shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Publishing Paper...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-3 h-5 w-5" />
                      Submit & Publish Instantly
                    </>
                  )}
                </Button>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  By submitting, you confirm this is an authentic question paper.
                </p>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>

      {/* Add Subject Dialog */}
      <Dialog open={showSubjectDialog} onOpenChange={setShowSubjectDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Missing Subject</DialogTitle>
            <DialogDescription>
              Instantly create a new subject for {STAGES.find((s) => s.value === stage)?.label} (Year {year}).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newSubjectName">Subject Name</Label>
              <Input
                id="newSubjectName"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="e.g. Data Structures"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newSubjectCode">Subject Code <span className="text-muted-foreground font-normal">(Optional)</span></Label>
              <Input
                id="newSubjectCode"
                value={newSubjectCode}
                onChange={(e) => setNewSubjectCode(e.target.value)}
                placeholder="e.g. CS201"
              />
            </div>
            {subjectError && <p className="text-sm font-medium text-destructive">{subjectError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubjectDialog(false)} disabled={creatingSubject}>
              Cancel
            </Button>
            <Button onClick={handleCreateSubject} disabled={creatingSubject}>
              {creatingSubject ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
              ) : (
                "Create Subject"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
