-- CreateEnum
CREATE TYPE "PaperStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "Paper" (
    "id" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "paperYear" INTEGER NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "uploaderName" TEXT,
    "status" "PaperStatus" NOT NULL DEFAULT 'pending',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
);
