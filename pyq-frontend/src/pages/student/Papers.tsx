import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { API_URL } from "../../lib/api";
import PaperCard from "../../components/PaperCard";

interface Paper {
  id: string;
  stage: string;
  level: string;
  subject: string;
  examType: string;
  paperYear: number;
  pdfUrl: string;
  uploaderName: string;
  status: string;
}

function Papers() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();

  const [subject, setSubject] = useState(searchParams.get("subject") ?? "all");
  const [examType, setExamType] = useState(searchParams.get("examType") ?? "all");
  const [year, setYear] = useState(searchParams.get("year") ?? "all");

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/papers`);
        if (!res.ok) throw new Error("Failed to load papers");
        const data = await res.json();
        setPapers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  const approvedPapers = useMemo(
    () => papers.filter((p) => p.status === "approved"),
    [papers]
  );

  const subjects = useMemo(
    () => Array.from(new Set(approvedPapers.map((p) => p.subject))).sort(),
    [approvedPapers]
  );
  const examTypes = useMemo(
    () => Array.from(new Set(approvedPapers.map((p) => p.examType))).sort(),
    [approvedPapers]
  );
  const years = useMemo(
    () =>
      Array.from(new Set(approvedPapers.map((p) => p.paperYear)))
        .sort((a, b) => b - a),
    [approvedPapers]
  );

  const filteredPapers = useMemo(() => {
    return approvedPapers.filter((p) => {
      const matchesSubject = subject === "all" || p.subject === subject;
      const matchesExamType = examType === "all" || p.examType === examType;
      const matchesYear = year === "all" || String(p.paperYear) === year;
      return matchesSubject && matchesExamType && matchesYear;
    });
  }, [approvedPapers, subject, examType, year]);

  const clearFilters = () => {
    setSubject("all");
    setExamType("all");
    setYear("all");
  };

  const hasActiveFilters = subject !== "all" || examType !== "all" || year !== "all";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-zinc-900">All papers</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {loading
            ? "Loading..."
            : `${filteredPapers.length} of ${approvedPapers.length} papers`}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <Select value={subject} onValueChange={(value) => setSubject(value ?? "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            {subjects.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={examType} onValueChange={(value) => setExamType(value ?? "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All exam types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All exam types</SelectItem>
            {examTypes.map((e) => (
              <SelectItem key={e} value={e}>{e}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={(value) => setYear(value ?? "all")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All years</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="text-zinc-500">
            Clear
          </Button>
        )}
      </div>

      {loading && <p className="text-sm text-zinc-500">Loading papers...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && filteredPapers.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-sm text-zinc-500">No papers match your filters.</p>
        </Card>
      )}

      {!loading && filteredPapers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPapers.map((paper) => (
            <PaperCard
              key={paper.id}
              subject={paper.subject}
              stage={paper.stage}
              level={paper.level}
              examType={paper.examType}
              paperYear={paper.paperYear}
              pdfUrl={paper.pdfUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Papers;