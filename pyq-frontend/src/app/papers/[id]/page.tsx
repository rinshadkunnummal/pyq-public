"use client";

import { api } from "@/lib/api";
import { Paper } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PaperDetailsPage() {
  const params = useParams();
  const paperId = params.id as string;

  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        setLoading(true);
        const data = await api.getPaperById(paperId);
        setPaper(data);
      } catch (err) {
        console.error("Failed to fetch paper:", err);
        setError("Failed to load paper. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (paperId) {
      fetchPaper();
    }
  }, [paperId]);

  const handleDownload = () => {
    if (paper?.pdfUrl) {
      window.open(paper.pdfUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-[#111111] rounded w-1/4"></div>
            <div className="h-12 bg-[#111111] rounded w-3/4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-[#111111] rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-[#111111] rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              {error || "Paper not found"}
            </h1>
            <Link href="/papers">
              <Button className="bg-zinc-700 text-white hover:bg-zinc-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Papers
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/papers" className="inline-block mb-6">
          <Button
            variant="outline"
            className="border-[#27272A] text-zinc-300 hover:bg-[#1A1A1A]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Papers
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {paper.subject}
          </h1>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-zinc-800 text-zinc-100">{paper.stage}</Badge>
            <Badge className="bg-zinc-800 text-zinc-100">{paper.level}</Badge>
            <Badge className="bg-green-500/20 text-green-400">Approved</Badge>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111111] border border-[#27272A] rounded-lg p-4">
            <div className="text-xs text-zinc-500 mb-1">Exam Type</div>
            <div className="text-lg font-semibold text-white">
              {paper.examType}
            </div>
          </div>
          <div className="bg-[#111111] border border-[#27272A] rounded-lg p-4">
            <div className="text-xs text-zinc-500 mb-1">Year</div>
            <div className="text-lg font-semibold text-white">
              {paper.paperYear}
            </div>
          </div>
          <div className="bg-[#111111] border border-[#27272A] rounded-lg p-4">
            <div className="text-xs text-zinc-500 mb-1">Added</div>
            <div className="text-lg font-semibold text-white">
              {new Date(paper.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="bg-[#111111] border border-[#27272A] rounded-lg p-4">
            <div className="text-xs text-zinc-500 mb-1">Status</div>
            <div className="text-lg font-semibold text-green-400">Approved</div>
          </div>
        </div>

        {/* Uploader Info */}
        {paper.uploaderName && (
          <div className="bg-[#111111] border border-[#27272A] rounded-lg p-4 mb-8">
            <div className="text-sm text-zinc-500 mb-1">Uploaded by</div>
            <div className="text-white font-medium">{paper.uploaderName}</div>
          </div>
        )}

        {/* Admin Note */}
        {paper.adminNote && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8">
            <div className="text-sm text-blue-300 font-semibold mb-1">
              Admin Note
            </div>
            <div className="text-blue-100">{paper.adminNote}</div>
          </div>
        )}

        {/* PDF Preview / Embed */}
        <div className="bg-[#111111] border border-[#27272A] rounded-lg mb-8 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#27272A]">
            <h2 className="text-lg font-semibold text-white">PDF Preview</h2>
            <div className="flex gap-2">
              <a
                href={paper.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#27272A] text-zinc-300 hover:bg-[#1A1A1A]"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </Button>
              </a>
              <Button
                onClick={handleDownload}
                size="sm"
                className="bg-zinc-700 text-white hover:bg-zinc-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* PDF Embed */}
          <div className="min-h-96 bg-[#0A0A0A] flex items-center justify-center">
            <div className="text-center">
              <p className="text-zinc-400 mb-4">
                PDF preview loading... If not visible, download to view.
              </p>
              <iframe
                src={`${paper.pdfUrl}#toolbar=0`}
                className="w-full h-96 border-0"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-[#111111] border border-[#27272A] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Paper Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-zinc-500">Subject</div>
              <div className="text-white font-medium">{paper.subject}</div>
            </div>
            <div>
              <div className="text-sm text-zinc-500">Stage</div>
              <div className="text-white font-medium">{paper.stage}</div>
            </div>
            <div>
              <div className="text-sm text-zinc-500">Difficulty Level</div>
              <div className="text-white font-medium">{paper.level}</div>
            </div>
            <div>
              <div className="text-sm text-zinc-500">Exam Type</div>
              <div className="text-white font-medium">{paper.examType}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
