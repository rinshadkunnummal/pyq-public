import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

function StudentSubmit() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Please attach a file");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subject", subject);
      formData.append("semester", semester);
      formData.append("year", year);
      formData.append("file", file);

      const res = await fetch("http://localhost:3000/api/papers/submit", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to submit paper");

      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm font-medium text-zinc-900">Paper submitted</p>
        <p className="text-sm text-zinc-500 mt-1">
          It'll appear once an admin approves it. Redirecting...
        </p>
      </Card>
    );
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold text-zinc-900 mb-1">Submit a paper</h1>
      <p className="text-sm text-zinc-500 mb-8">
        Help others out — submissions are reviewed before going live.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Data Structures End Sem 2023"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Data Structures"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="semester">Semester</Label>
            <Input
              id="semester"
              type="text"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="e.g. 4"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g. 2023"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="file">File</Label>
          <Input
            id="file"
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Submitting..." : "Submit paper"}
        </Button>
      </form>
    </div>
  );
}

export default StudentSubmit;