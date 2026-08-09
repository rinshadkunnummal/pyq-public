"use client";

import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title = "No papers found",
  description = "Try adjusting your filters or search terms.",
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-[#111111] border border-[#27272A] rounded-lg p-8 text-center max-w-md">
        <FileQuestion className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-zinc-400 text-sm mb-6">{description}</p>
        {actionLabel && actionHref && (
          <Link href={actionHref}>
            <Button className="bg-zinc-700 text-white hover:bg-zinc-600">
              {actionLabel}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
