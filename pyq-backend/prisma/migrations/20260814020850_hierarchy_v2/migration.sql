-- CreateEnum
CREATE TYPE "public"."PaperStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."ExamType" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ClassLevel" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "examTypeId" TEXT NOT NULL,

    CONSTRAINT "ClassLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subject" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "classLevelId" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Paper" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "examYear" INTEGER NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "status" "public"."PaperStatus" NOT NULL DEFAULT 'PENDING',
    "subjectId" TEXT NOT NULL,
    "uploadedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamType_slug_key" ON "public"."ExamType"("slug");

-- CreateIndex
CREATE INDEX "ClassLevel_examTypeId_idx" ON "public"."ClassLevel"("examTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassLevel_examTypeId_slug_key" ON "public"."ClassLevel"("examTypeId", "slug");

-- CreateIndex
CREATE INDEX "Subject_classLevelId_idx" ON "public"."Subject"("classLevelId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_classLevelId_code_key" ON "public"."Subject"("classLevelId", "code");

-- CreateIndex
CREATE INDEX "Paper_subjectId_idx" ON "public"."Paper"("subjectId");

-- CreateIndex
CREATE INDEX "Paper_status_idx" ON "public"."Paper"("status");

-- AddForeignKey
ALTER TABLE "public"."ClassLevel" ADD CONSTRAINT "ClassLevel_examTypeId_fkey" FOREIGN KEY ("examTypeId") REFERENCES "public"."ExamType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subject" ADD CONSTRAINT "Subject_classLevelId_fkey" FOREIGN KEY ("classLevelId") REFERENCES "public"."ClassLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Paper" ADD CONSTRAINT "Paper_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
