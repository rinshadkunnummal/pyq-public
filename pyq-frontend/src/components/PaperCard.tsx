import { Card } from "./ui/card";

interface PaperCardProps {
  subject: string;
  stage: string;
  level: string;
  examType: string;
  paperYear: number;
  pdfUrl: string;
}

function PaperCard({ subject, stage, level, examType, paperYear, pdfUrl }: PaperCardProps) {
  const downloadUrl = pdfUrl.includes("fl_attachment")
    ? pdfUrl
    : pdfUrl.replace("/upload/", "/upload/fl_attachment/");

  return (
    <Card className="p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <p className="text-sm font-medium text-zinc-900">{paperYear}</p>
          <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 capitalize">
            {examType}
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-zinc-900">{subject}</span>
          <span className="text-xs text-zinc-500 capitalize">
            {stage} · {level}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <a
          href={downloadUrl}
          className="flex-1 inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
        >
          Download
        </a>
      </div>
    </Card>
  );
}

export default PaperCard;