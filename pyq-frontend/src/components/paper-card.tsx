"use client";

import { Paper } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import Link from "next/link";

interface PaperCardProps {
  paper: Paper;
}

export function PaperCard({ paper }: PaperCardProps) {
  const handleDownload = () => {
    if (paper.pdfUrl) {
      window.open(paper.pdfUrl, "_blank");
    }
  };

  return (
    <div className="bg-[#111111] border border-[#27272A] rounded-lg p-4 hover:border-[#3F3F46] transition-colors group">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white truncate mb-2">
          {paper.subject}
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge
            variant="secondary"
            className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
          >
            {paper.stage}
          </Badge>
          <Badge
            variant="secondary"
            className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
          >
            {paper.level}
          </Badge>
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-2 mb-4 text-sm text-zinc-400">
        <div className="flex justify-between">
          <span className="text-zinc-500">Exam Type</span>
          <span className="text-zinc-300">{paper.examType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Year</span>
          <span className="text-zinc-300">{paper.paperYear}</span>
        </div>
        {paper.uploaderName && (
          <div className="flex justify-between">
            <span className="text-zinc-500">Uploader</span>
            <span className="text-zinc-300 truncate">{paper.uploaderName}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-zinc-500">Added</span>
          <span className="text-zinc-300">
            {new Date(paper.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Status Badge */}
      {paper.status === "approved" && (
        <Badge className="mb-4 bg-green-500/20 text-green-400 hover:bg-green-500/30">
          Approved
        </Badge>
      )}
      {paper.status === "rejected" && (
        <Badge className="mb-4 bg-red-500/20 text-red-400 hover:bg-red-500/30">
          Rejected
        </Badge>
      )}
      {paper.status === "pending" && (
        <Badge className="mb-4 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">
          Pending Review
        </Badge>
      )}

      {/* Admin Note */}
      {paper.adminNote && (
        <div className="mb-4 p-2 bg-[#0A0A0A] border border-[#27272A] rounded text-xs text-zinc-400">
          <span className="font-semibold text-zinc-300">Note: </span>
          {paper.adminNote}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Link href={`/papers/${paper.id}`} className="flex-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-[#27272A] text-zinc-300 hover:bg-[#1A1A1A]"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
        </Link>
        <Button
          onClick={handleDownload}
          size="sm"
          className="flex-1 bg-zinc-700 text-white hover:bg-zinc-600"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
}
