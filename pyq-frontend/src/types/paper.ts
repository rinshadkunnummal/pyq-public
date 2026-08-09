export type PaperStatus = 'pending' | 'approved' | 'rejected'

export type Paper = {
  id: string
  stage: string
  level: string
  subject: string
  examType: string
  paperYear: number
  pdfUrl: string
  uploaderName: string | null
  status: PaperStatus
  createdAt: string
  adminNote?: string | null
  approvedAt?: string | null
}