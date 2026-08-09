"use client";

import { FilterBar, FilterValues } from "@/components/filter-bar";
import { PaperGrid } from "@/components/paper-grid";
import { EmptyState } from "@/components/empty-state";
import { LoadingGrid } from "@/components/loading-grid";
import { api } from "@/lib/api";
import { Paper } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";

export default function PapersPage() {
  const [allPapers, setAllPapers] = useState<Paper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const papers = await api.getPapers();
        // Filter only approved papers
        const approved = papers.filter((p) => p.status === "approved");
        setAllPapers(approved);
        setFilteredPapers(approved);
      } catch (err) {
        console.error("Failed to fetch papers:", err);
        setError("Failed to load papers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  const handleFilterChange = useCallback(
    (filters: FilterValues) => {
      let results = allPapers;

      // Apply search filter
      if (filters.search) {
        results = api.searchPapers(results, filters.search);
      }

      // Apply other filters
      const filterObj: {
        stage?: string;
        level?: string;
        examType?: string;
        year?: number;
      } = {};

      if (filters.stage) filterObj.stage = filters.stage;
      if (filters.level) filterObj.level = filters.level;
      if (filters.examType) filterObj.examType = filters.examType;
      if (filters.year) filterObj.year = parseInt(filters.year);

      if (
        filters.stage ||
        filters.level ||
        filters.examType ||
        filters.year
      ) {
        results = api.filterPapers(results, filterObj);
      }

      setFilteredPapers(results);
    },
    [allPapers]
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Previous Year Questions
          </h1>
          <p className="text-zinc-400">
            {!loading && filteredPapers.length > 0
              ? `${filteredPapers.length} paper${filteredPapers.length !== 1 ? "s" : ""} found`
              : "Filter and search through approved papers"}
          </p>
        </div>

        {/* Filters */}
        {!error && <FilterBar onFilterChange={handleFilterChange} isLoading={loading} />}

        {/* Content */}
        {error && (
          <EmptyState
            title="Failed to load papers"
            description={error}
            actionLabel="Try again"
            actionHref="/papers"
          />
        )}

        {loading && <LoadingGrid />}

        {!loading && filteredPapers.length > 0 && (
          <PaperGrid papers={filteredPapers} />
        )}

        {!loading && filteredPapers.length === 0 && !error && (
          <EmptyState
            title="No papers found"
            description="Try adjusting your filters or search terms to find papers."
            actionLabel="Clear filters"
            actionHref="/papers"
          />
        )}
      </div>
    </div>
  );
}
