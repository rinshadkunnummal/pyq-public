"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState, useCallback } from "react";

export interface FilterValues {
  search: string;
  stage: string;
  level: string;
  examType: string;
  year: string;
}

interface FilterBarProps {
  onFilterChange: (filters: FilterValues) => void;
  isLoading?: boolean;
}

// Sample values - in production, these could come from the backend
const STAGES = ["Class 11", "Class 12", "Bachelor", "Master"];
const LEVELS = ["Easy", "Medium", "Hard"];
const EXAM_TYPES = ["Mid-term", "Final", "Semester"];
const YEARS = Array.from({ length: 10 }, (_, i) =>
  (new Date().getFullYear() - i).toString()
);

export function FilterBar({ onFilterChange, isLoading }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    stage: "",
    level: "",
    examType: "",
    year: "",
  });

  const handleFilterChange = useCallback(
    (key: keyof FilterValues, value: string) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
      onFilterChange(newFilters);
    },
    [filters, onFilterChange]
  );

  const handleReset = () => {
    const emptyFilters: FilterValues = {
      search: "",
      stage: "",
      level: "",
      examType: "",
      year: "",
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters =
    filters.search ||
    filters.stage ||
    filters.level ||
    filters.examType ||
    filters.year;

  return (
    <div className="space-y-4 mb-6">
      {/* Search Input */}
      <div>
        <Input
          placeholder="Search by subject, stage, or level..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          disabled={isLoading}
          className="bg-[#111111] border-[#27272A] text-white placeholder:text-zinc-500"
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Select
          value={filters.stage}
          onValueChange={(value) => handleFilterChange("stage", value)}
          disabled={isLoading}
        >
          <SelectTrigger className="bg-[#111111] border-[#27272A] text-white">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent className="bg-[#111111] border-[#27272A]">
            {STAGES.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.level}
          onValueChange={(value) => handleFilterChange("level", value)}
          disabled={isLoading}
        >
          <SelectTrigger className="bg-[#111111] border-[#27272A] text-white">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent className="bg-[#111111] border-[#27272A]">
            {LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.examType}
          onValueChange={(value) => handleFilterChange("examType", value)}
          disabled={isLoading}
        >
          <SelectTrigger className="bg-[#111111] border-[#27272A] text-white">
            <SelectValue placeholder="Exam Type" />
          </SelectTrigger>
          <SelectContent className="bg-[#111111] border-[#27272A]">
            {EXAM_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.year}
          onValueChange={(value) => handleFilterChange("year", value)}
          disabled={isLoading}
        >
          <SelectTrigger className="bg-[#111111] border-[#27272A] text-white">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="bg-[#111111] border-[#27272A]">
            {YEARS.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="border-[#27272A] text-zinc-300 hover:bg-[#1A1A1A]"
          >
            <X className="w-4 h-4 mr-1" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
