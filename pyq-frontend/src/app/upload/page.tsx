"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Upload, FileText, CheckCircle } from "lucide-react";

export default function UploadPage() {
  const [formData, setFormData] = useState({
    stage: "",
    level: "",
    subject: "",
    examType: "",
    paperYear: new Date().getFullYear().toString(),
    uploaderName: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const STAGES = ["Class 11", "Class 12", "Bachelor", "Master"];
  const LEVELS = ["Easy", "Medium", "Hard"];
  const EXAM_TYPES = ["Mid-term", "Final", "Semester"];
  const YEARS = Array.from({ length: 10 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === "application/pdf") {
      setFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0].type === "application/pdf") {
      setFile(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    if (
      !formData.stage ||
      !formData.level ||
      !formData.subject ||
      !formData.examType
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // TODO: Implement actual upload logic with API
    console.log("Form data:", formData);
    console.log("File:", file);

    // Show success state
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        stage: "",
        level: "",
        subject: "",
        examType: "",
        paperYear: new Date().getFullYear().toString(),
        uploaderName: "",
      });
      setFile(null);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">
              Upload Submitted!
            </h1>
            <p className="text-zinc-400 mb-8">
              Thank you for contributing. Your paper will be reviewed by our team
              and published shortly.
            </p>
            <Button
              onClick={() => setSubmitted(false)}
              className="bg-zinc-700 text-white hover:bg-zinc-600"
            >
              Upload Another Paper
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Upload a Paper
          </h1>
          <p className="text-zinc-400">
            Share previous year questions with the community. Help others
            prepare better.
          </p>
        </div>

        {/* Form */}
        <div className="bg-[#111111] border border-[#27272A] rounded-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Stage
                </label>
                <Select
                  value={formData.stage}
                  onValueChange={(value) =>
                    handleInputChange("stage", value)
                  }
                >
                  <SelectTrigger className="bg-[#0A0A0A] border-[#27272A] text-white">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111111] border-[#27272A]">
                    {STAGES.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Level
                </label>
                <Select
                  value={formData.level}
                  onValueChange={(value) =>
                    handleInputChange("level", value)
                  }
                >
                  <SelectTrigger className="bg-[#0A0A0A] border-[#27272A] text-white">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111111] border-[#27272A]">
                    {LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Subject
              </label>
              <Input
                type="text"
                placeholder="e.g., Mathematics, Physics, Chemistry"
                value={formData.subject}
                onChange={(e) =>
                  handleInputChange("subject", e.target.value)
                }
                className="bg-[#0A0A0A] border-[#27272A] text-white placeholder:text-zinc-500"
              />
            </div>

            {/* Exam Type and Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Exam Type
                </label>
                <Select
                  value={formData.examType}
                  onValueChange={(value) =>
                    handleInputChange("examType", value)
                  }
                >
                  <SelectTrigger className="bg-[#0A0A0A] border-[#27272A] text-white">
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111111] border-[#27272A]">
                    {EXAM_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Year
                </label>
                <Select
                  value={formData.paperYear}
                  onValueChange={(value) =>
                    handleInputChange("paperYear", value)
                  }
                >
                  <SelectTrigger className="bg-[#0A0A0A] border-[#27272A] text-white">
                    <SelectValue placeholder="Select year" />
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
            </div>

            {/* Uploader Name (Optional) */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Your Name (Optional)
              </label>
              <Input
                type="text"
                placeholder="Enter your name for credit"
                value={formData.uploaderName}
                onChange={(e) =>
                  handleInputChange("uploaderName", e.target.value)
                }
                className="bg-[#0A0A0A] border-[#27272A] text-white placeholder:text-zinc-500"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                PDF File
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? "border-zinc-400 bg-[#1A1A1A]"
                    : "border-[#27272A] hover:border-[#3F3F46]"
                }`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />

                <label
                  htmlFor="file-input"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {file ? (
                    <>
                      <FileText className="w-10 h-10 text-green-500 mb-2" />
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-zinc-400 text-sm">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-zinc-500 mb-2" />
                      <p className="text-white font-medium mb-1">
                        Drag and drop your PDF here
                      </p>
                      <p className="text-zinc-400 text-sm">
                        or click to select from your computer
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-zinc-700 text-white hover:bg-zinc-600 h-11 text-base"
            >
              <Upload className="w-4 h-4 mr-2" />
              Submit Paper
            </Button>

            <p className="text-xs text-zinc-500 text-center">
              By uploading, you agree to share this paper publicly. Uploaded
              papers will be reviewed by our team.
            </p>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">
            Upload Guidelines
          </h3>
          <ul className="space-y-2 text-blue-200 text-sm">
            <li>✓ Only PDF files are supported</li>
            <li>✓ Maximum file size: 10 MB</li>
            <li>✓ Ensure the paper is clear and readable</li>
            <li>✓ Fill in all required information accurately</li>
            <li>✓ Papers are reviewed before publishing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
