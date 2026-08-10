import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { API_URL } from "../../lib/api";

interface Paper {
  id: string;
  subject: string;
  examType: string;
  paperYear: number;
  status: string;
}

function StudentHome() {
  const [papers, setPapers] = useState<Paper[]>([]);

  const [subject, setSubject] = useState("");
  const [examType, setExamType] = useState("");
  const [year, setYear] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/papers`);
        if (!res.ok) return;
        const data = await res.json();
        setPapers(data);
      } catch {
        // Silent fail is fine here — worst case the dropdowns are just empty
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
      Array.from(new Set(approvedPapers.map((p) => p.paperYear))).sort(
        (a, b) => b - a
      ),
    [approvedPapers]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (subject) params.set("subject", subject);
    if (examType) params.set("examType", examType);
    if (year) params.set("year", year);

    navigate(`/papers${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <section className="py-20 text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 mb-3">
        Find your previous year papers
      </h1>
      <p className="text-zinc-500 mb-10">
        Search by subject, exam type, or year.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-center"
      >
        <Select value={subject} onValueChange={(value) => setSubject(value ?? "")}>
          <SelectTrigger className="flex-1 sm:w-[180px]">
            <SelectValue placeholder="Any subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={examType} onValueChange={(value) => setExamType(value ?? "")}>
          <SelectTrigger className="sm:w-[160px]">
            <SelectValue placeholder="Any exam type" />
          </SelectTrigger>
          <SelectContent>
            {examTypes.map((e) => (
              <SelectItem key={e} value={e}>{e}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={(value) => setYear(value ?? "")}>
          <SelectTrigger className="sm:w-[140px]">
            <SelectValue placeholder="Any year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button type="submit">Search</Button>
      </form>
    </section>
  );
}

export default StudentHome;