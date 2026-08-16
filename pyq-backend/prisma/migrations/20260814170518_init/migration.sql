-- CreateEnum
CREATE TYPE "public"."Stage" AS ENUM ('SECONDARY', 'SENIOR_SECONDARY', 'DEGREE', 'PG');

-- CreateEnum
CREATE TYPE "public"."PaperType" AS ENUM ('ANNUAL', 'HALF_YEARLY', 'MODEL', 'INTERNAL', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."PaperStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "stage" "public"."Stage" NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Paper" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "examYear" INTEGER NOT NULL,
    "paperType" "public"."PaperType" NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "status" "public"."PaperStatus" NOT NULL DEFAULT 'PENDING',
    "subjectId" TEXT NOT NULL,
    "uploaderName" TEXT,
    "uploaderEmail" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubjectSuggestion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stage" "public"."Stage" NOT NULL,
    "year" INTEGER NOT NULL,
    "suggestedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Subject_stage_year_idx" ON "public"."Subject"("stage", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_stage_year_name_key" ON "public"."Subject"("stage", "year", "name");

-- CreateIndex
CREATE INDEX "Paper_status_idx" ON "public"."Paper"("status");

-- CreateIndex
CREATE INDEX "Paper_examYear_idx" ON "public"."Paper"("examYear");

-- CreateIndex
CREATE INDEX "Paper_subjectId_idx" ON "public"."Paper"("subjectId");

-- CreateIndex
CREATE INDEX "SubjectSuggestion_stage_year_idx" ON "public"."SubjectSuggestion"("stage", "year");

-- CreateIndex
CREATE INDEX "SubjectSuggestion_status_idx" ON "public"."SubjectSuggestion"("status");

-- AddForeignKey
ALTER TABLE "public"."Paper" ADD CONSTRAINT "Paper_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
