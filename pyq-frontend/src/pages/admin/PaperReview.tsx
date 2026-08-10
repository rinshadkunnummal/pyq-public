import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

interface Paper {
  id: string;
  title: string;
  subject: string;
  semester: string;
  year: string;
  fileUrl: string;
  submittedBy?: string;
}

function AdminPaperReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/admin/papers/${id}`);
        if (!res.ok) throw new Error("Paper not found");
        const data = await res.json();
        setPaper(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load paper");
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [id]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/admin/papers/${id}/approve`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to approve paper");
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/admin/papers/${id}/reject`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to reject paper");
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setActionLoading(false);
    }
  };

  if (loading) {
    return <p className="text-zinc-400 text-sm">Loading paper...</p>;
  }

  if (error || !paper) {
    return (
      <div>
        <p className="text-red-400 text-sm mb-4">{error ?? "Paper not found"}</p>
        <Link to="/admin" className="text-sm text-zinc-400 hover:text-white underline">
          Back to pending
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/admin" className="text-sm text-zinc-500 hover:text-zinc-300 mb-6 inline-block">
        ← Back to pending
      </Link>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-xl font-semibold text-zinc-100 mb-1">{paper.title}</h1>
        <p className="text-sm text-zinc-500 mb-6">
          {paper.subject} · Semester {paper.semester} · {paper.year}
        </p>

        <dl className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <dt className="text-zinc-500">Submitted by</dt>
            <dd className="text-zinc-200">{paper.submittedBy ?? "Unknown"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Paper ID</dt>
            <dd className="text-zinc-200">{paper.id}</dd>
          </div>
        </dl>

        <a
          href={paper.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-zinc-300 underline hover:text-white mb-8"
        >
          View file
        </a>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={handleApprove}
            disabled={actionLoading}
            className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white transition-colors disabled:opacity-50"
          >
            {actionLoading ? "Working..." : "Approve"}
          </button>
          <button
            onClick={handleReject}
            disabled={actionLoading}
            className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {actionLoading ? "Working..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPaperReview;