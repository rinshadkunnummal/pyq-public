"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaperDetailsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/papers" className="inline-block mb-6">
          <Button
            variant="outline"
            className="border-[#27272A] text-zinc-300 hover:bg-[#1A1A1A]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Papers
          </Button>
        </Link>

        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Paper not found
          </h1>
          <p className="text-zinc-400 mb-8">
            We couldn't load the paper you're looking for. It may have been removed
            or the link might be incorrect.
          </p>
          {error?.message && (
            <p className="text-zinc-500 text-sm mb-8 bg-[#111111] border border-[#27272A] rounded p-4">
              Error: {error.message}
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={reset}
              variant="outline"
              className="border-[#27272A] text-zinc-300 hover:bg-[#1A1A1A]"
            >
              Try Again
            </Button>
            <Link href="/papers">
              <Button className="bg-zinc-700 text-white hover:bg-zinc-600">
                Back to Papers
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
