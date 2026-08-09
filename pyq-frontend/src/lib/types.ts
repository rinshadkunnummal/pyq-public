export type PaperStatus = "pending" | "approved" | "rejected";

export interface Paper {
  id: string;
  stage: string;
  level: string;
  subject: string;
  examType: string;
  paperYear: number;
  pdfUrl: string;
  uploaderName?: string;
  status: PaperStatus;
  adminNote?: string;
  createdAt: string;
  approvedAt?: string;
}

export interface PaperFilters {
  stage?: string;
  level?: string;
  subject?: string;
  examType?: string;
  year?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaperListResponse extends ApiResponse<Paper[]> {
  data: Paper[];
}

export interface UploadFormData {
  stage: string;
  level: string;
  subject: string;
  examType: string;
  paperYear: number;
  uploaderName?: string;
  pdf: File;
}
