"use client";

import { Paper } from "@/lib/types";
import { PaperCard } from "./paper-card";

interface PaperGridProps {
  papers: Paper[];
}

export function PaperGrid({ papers }: PaperGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {papers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} />
      ))}
    </div>
  );
}
