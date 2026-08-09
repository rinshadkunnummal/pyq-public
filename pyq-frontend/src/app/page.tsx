"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PaperGrid } from "@/components/paper-grid";
import { LoadingGrid } from "@/components/loading-grid";
import { EmptyState } from "@/components/empty-state";
import { api } from "@/lib/api";
import { Paper } from "@/lib/types";
import { SearchIcon, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

export default function HomePage() {
  const [latestPapers, setLatestPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const fetchLatestPapers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const papers = await api.getPapers();

      if (!Array.isArray(papers) || papers.length === 0) {
        setLatestPapers([]);
        return;
      }

      // Filter approved papers and get latest 6
      const approved = papers.filter((p) => p.status === "approved");
      setLatestPapers(
        approved
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
          .slice(0, 6)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load papers";
      console.error("[HomePage] Fetch error:", err);
      setError(errorMessage);
      setLatestPapers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestPapers();
  }, [retryCount, fetchLatestPapers]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  const filteredPapers = searchQuery
    ? api.searchPapers(latestPapers, searchQuery)
    : latestPapers;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-zinc-500">Previous Year Questions</span>
          </h1>
          <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
            Access a comprehensive collection of previous year exam questions. Study smart, prepare better.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <Input
                placeholder="Search by subject, stage, or level..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#111111] border-[#27272A] text-white placeholder:text-zinc-500 h-12"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge
              variant="secondary"
              className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700 cursor-pointer"
            >
              All Stages
            </Badge>
            <Badge
              variant="secondary"
              className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700 cursor-pointer"
            >
              Latest Papers
            </Badge>
            <Badge
              variant="secondary"
              className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700 cursor-pointer"
            >
              Approved Quality
            </Badge>
          </div>

          {/* CTA Button */}
          <Link href="/papers">
            <Button className="bg-zinc-700 text-white hover:bg-zinc-600 px-8 h-11">
              Browse All Papers
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Divider */}
        <div className="my-16 h-px bg-gradient-to-r from-transparent via-[#27272A] to-transparent"></div>

        {/* Latest Papers Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Latest Approved Papers</h2>
          <p className="text-zinc-400 mb-8">
            Recently uploaded and verified papers
          </p>

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-300 mb-2">Failed to Load Papers</h3>
                  <p className="text-red-200 text-sm mb-4 leading-relaxed">{error}</p>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={handleRetry}
                      size="sm"
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry
                    </Button>
                    <Link href="/papers">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-300 hover:bg-red-500/10"
                      >
                        Browse All Papers
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && !error && <LoadingGrid />}

          {/* Success State - Papers Loaded */}
          {!loading && !error && filteredPapers.length > 0 && (
            <PaperGrid papers={filteredPapers} />
          )}

          {/* Empty State */}
          {!loading && !error && filteredPapers.length === 0 && latestPapers.length > 0 && (
            <EmptyState
              title="No papers match your search"
              description="Try adjusting your search terms"
            />
          )}

          {/* No Papers Available */}
          {!loading && !error && latestPapers.length === 0 && (
            <EmptyState
              title="No approved papers available"
              description="Papers will appear here once they are uploaded and approved"
              actionLabel="Upload a Paper"
              actionHref="/upload"
            />
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-[#111111] border-y border-[#27272A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1000+</div>
              <div className="text-zinc-400">Papers Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-zinc-400">Contributors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-zinc-400">Subjects</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
