import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Paper {
  id: string;
  title: string;
  subject: string;
  semester: string;
  year: string;
  submittedBy?: string;
}

function AdminPending() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/admin/papers/pending");
        if (!res.ok) throw new Error("Failed to load pending papers");
        const data = await res.json();
        setPapers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-zinc-100">Pending submissions</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {loading ? "Loading..." : `${papers.length} paper${papers.length === 1 ? "" : "s"} awaiting review`}
        </p>
      </div>

      {loading && <p className="text-sm text-zinc-400">Loading pending papers...</p>}

      {error && <p className="text-sm text-red-400">{error}</p>}

      {!loading && !error && papers.length === 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-sm text-zinc-500">No papers waiting for review.</p>
        </div>
      )}

      {!loading && papers.length > 0 && (
        <div className="rounded-lg border border-zinc-800 overflow-hidden">
          {papers.map((paper, index) => (
            <Link
              key={paper.id}
              to={`/admin/papers/${paper.id}`}
              className={`flex items-center justify-between px-5 py-4 hover:bg-zinc-900 transition-colors ${
                index !== papers.length - 1 ? "border-b border-zinc-800" : ""
              }`}
            >
              <div>
                <p className="text-sm font-medium text-zinc-100">{paper.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {paper.subject} · Semester {paper.semester} · {paper.year}
                  {paper.submittedBy ? ` · ${paper.submittedBy}` : ""}
                </p>
              </div>
              <span className="text-xs text-zinc-600">Review →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPending;