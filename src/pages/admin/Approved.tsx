import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { API_URL } from "../../lib/api"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Label } from "../../components/ui/label"
import { Separator } from "../../components/ui/separator"
import { Button } from "../../components/ui/button"

import {
    CheckCircle2,
    Eye,
    Search,
    X,
    Filter,
} from "lucide-react"

interface Paper {
    id: string
    stage: string
    level: string
    subject: string
    examType: string
    paperYear: number
    pdfUrl: string
    uploaderName: string
    status: "pending" | "approved"
}

export default function AdminApproved() {
    const [papers, setPapers] = useState<Paper[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Filters
    const [query, setQuery] = useState("")
    const [stageFilter, setStageFilter] = useState("all")
    const [levelFilter, setLevelFilter] = useState("all")
    const [examTypeFilter, setExamTypeFilter] = useState("all")
    const [yearFilter, setYearFilter] = useState("all")


    useEffect(() => {
        const fetchApproved = async () => {
            try {
                const res = await fetch(`${API_URL}/api/admin/papers`)

                if (!res.ok) {
                    throw new Error("Failed to load approved papers")
                }

                const data: Paper[] = await res.json()

                setPapers(data.filter((paper) => paper.status === "approved"))
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong")
            } finally {
                setLoading(false)
            }
        }

        fetchApproved()
    }, [])

    // Unique values for filters
    const stages = [...new Set(papers.map((p) => p.stage))]
    const levels = [...new Set(papers.map((p) => p.level))]
    const examTypes = [...new Set(papers.map((p) => p.examType))]
    const years = [...new Set(papers.map((p) => p.paperYear))].sort((a, b) => b - a)

    const filteredPapers = useMemo(() => {
        return papers.filter((paper) => {
            const matchesQuery =
                paper.subject.toLowerCase().includes(query.toLowerCase()) ||
                paper.uploaderName.toLowerCase().includes(query.toLowerCase()) ||
                paper.examType.toLowerCase().includes(query.toLowerCase()) ||
                paper.level.toLowerCase().includes(query.toLowerCase()) ||
                String(paper.paperYear).includes(query)

            const matchesStage =
                stageFilter === "all" || paper.stage === stageFilter

            const matchesLevel =
                levelFilter === "all" || paper.level === levelFilter

            const matchesExamType =
                examTypeFilter === "all" || paper.examType === examTypeFilter

            const matchesYear =
                yearFilter === "all" || String(paper.paperYear) === yearFilter

            return (
                matchesQuery &&
                matchesStage &&
                matchesLevel &&
                matchesExamType &&
                matchesYear
            )
        })
    }, [papers, query, stageFilter, levelFilter, examTypeFilter, yearFilter])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="h-7 w-7 text-green-600" />
                        <h1 className="text-3xl font-bold tracking-tight">
                            Approved Papers
                        </h1>
                    </div>

                    <p className="text-muted-foreground">
                        Browse and manage all approved question papers.
                    </p>
                </div>

                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 w-fit px-3 py-1">
                    {filteredPapers.length} approved
                </Badge>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by subject, uploader, exam type, level, or year..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Popover>
                    <PopoverTrigger>
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filter
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent align="end" className="w-80 p-0">
                        <div className="p-4 pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Filters</p>
                                    <p className="text-sm text-muted-foreground">
                                        Refine approved papers
                                    </p>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setStageFilter("all")
                                        setLevelFilter("all")
                                        setExamTypeFilter("all")
                                        setYearFilter("all")
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        {/* Stage */}
                        <div className="p-4 space-y-3">
                            <Label className="text-xs uppercase text-muted-foreground">
                                Stage
                            </Label>

                            <RadioGroup value={stageFilter} onValueChange={setStageFilter}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="all" id="stage-all" />
                                    <Label htmlFor="stage-all">All stages</Label>
                                </div>

                                {stages.map((stage) => (
                                    <div key={stage} className="flex items-center space-x-2">
                                        <RadioGroupItem value={stage} id={`stage-${stage}`} />
                                        <Label htmlFor={`stage-${stage}`} className="capitalize">
                                            {stage}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <Separator />

                        {/* Level */}
                        <div className="p-4 space-y-3">
                            <Label className="text-xs uppercase text-muted-foreground">
                                Level
                            </Label>

                            <RadioGroup value={levelFilter} onValueChange={setLevelFilter}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="all" id="level-all" />
                                    <Label htmlFor="level-all">All levels</Label>
                                </div>

                                {levels.map((level) => (
                                    <div key={level} className="flex items-center space-x-2">
                                        <RadioGroupItem value={level} id={`level-${level}`} />
                                        <Label htmlFor={`level-${level}`} className="capitalize">
                                            {level.replace(/-/g, " ")}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <Separator />

                        {/* Exam type */}
                        <div className="p-4 space-y-3">
                            <Label className="text-xs uppercase text-muted-foreground">
                                Exam type
                            </Label>

                            <RadioGroup value={examTypeFilter} onValueChange={setExamTypeFilter}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="all" id="exam-all" />
                                    <Label htmlFor="exam-all">All exam types</Label>
                                </div>

                                {examTypes.map((type) => (
                                    <div key={type} className="flex items-center space-x-2">
                                        <RadioGroupItem value={type} id={`exam-${type}`} />
                                        <Label htmlFor={`exam-${type}`}>{type}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <Separator />

                        {/* Year */}
                        <div className="p-4 space-y-3">
                            <Label className="text-xs uppercase text-muted-foreground">
                                Year
                            </Label>

                            <RadioGroup value={yearFilter} onValueChange={setYearFilter}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="all" id="year-all" />
                                    <Label htmlFor="year-all">All years</Label>
                                </div>

                                {years.map((year) => (
                                    <div key={year} className="flex items-center space-x-2">
                                        <RadioGroupItem value={String(year)} id={`year-${year}`} />
                                        <Label htmlFor={`year-${year}`}>{year}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Loading */}
            {loading && (
                <div className="grid gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                                    <div className="h-3 w-72 animate-pulse rounded bg-muted" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Error */}
            {error && (
                <Card className="border-destructive">
                    <CardContent className="p-6">
                        <p className="text-sm text-destructive">{error}</p>
                    </CardContent>
                </Card>
            )}

            {/* Empty */}
            {!loading && !error && filteredPapers.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <CheckCircle2 className="mb-4 h-12 w-12 text-green-600" />
                        <h3 className="text-lg font-semibold">No papers found</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Try adjusting your search or filters.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Papers */}
            {!loading && filteredPapers.length > 0 && (
                <div className="grid gap-4">
                    {filteredPapers.map((paper) => (
                        <Card key={paper.id} className="transition-shadow hover:shadow-md">
                            <CardHeader className="pb-4">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-2">
                                        <CardTitle className="text-xl">{paper.subject}</CardTitle>

                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge variant="secondary">{paper.examType}</Badge>
                                            <Badge variant="outline" className="capitalize">
                                                {paper.stage}
                                            </Badge>
                                            <Badge variant="outline" className="capitalize">
                                                {paper.level.replace(/-/g, " ")}
                                            </Badge>
                                        </div>
                                    </div>

                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 w-fit">
                                        Approved
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">Year</p>
                                        <p className="font-medium">{paper.paperYear}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">Uploaded by</p>
                                        <p className="font-medium">{paper.uploaderName}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">Status</p>
                                        <p className="font-medium text-green-700">Approved</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 pt-2">
                                    <a
                                        href={paper.pdfUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        View PDF
                                    </a>

                                    <Link
                                        to={`/admin/papers/${paper.id}`}
                                        className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                                    >
                                        Review
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}