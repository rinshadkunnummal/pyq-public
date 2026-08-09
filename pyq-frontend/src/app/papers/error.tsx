"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function PapersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-zinc-400 mb-8">
            We encountered an error while loading the papers. Please try again.
          </p>
          {error?.message && (
            <p className="text-zinc-500 text-sm mb-8 bg-[#111111] border border-[#27272A] rounded p-4">
              Error: {error.message}
            </p>
          )}
          <Button
            onClick={reset}
            className="bg-zinc-700 text-white hover:bg-zinc-600"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
