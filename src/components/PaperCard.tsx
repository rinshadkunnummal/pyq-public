import { Card } from "./ui/card"

interface PaperCardProps {
  subject: string
  stage: string
  level: string
  examType: string
  paperYear: number
  pdfUrl: string
}

function formatLabel(value: string) {
  return value
    .replace(/-/g, " ") // first-year -> first year
    .replace(/\s+/g, " ") // normalize spaces
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()) // title case
}

function PaperCard({
  subject,
  stage,
  level,
  examType,
  paperYear,
  pdfUrl,
}: PaperCardProps) {
  const downloadUrl = pdfUrl.includes("fl_attachment")
    ? pdfUrl
    : pdfUrl.replace("/upload/", "/upload/fl_attachment/")

  return (
    <Card className="p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <p className="text-sm font-medium text-zinc-900">{paperYear}</p>

          <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
            {formatLabel(examType)}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-semibold tracking-tight text-zinc-900">
            {subject}
          </h3>

          <p className="text-sm text-zinc-500">
            {formatLabel(stage)} • {formatLabel(level)}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <a
          href={downloadUrl}
          className="inline-flex w-full items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Download
        </a>
      </div>
    </Card>
  )
}

export default PaperCard