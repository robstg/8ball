"use client";

interface ChartDownloadButtonProps {
  href: string;
  filename?: string;
  chartTitle: string;
  discipline?: string;
}

export function ChartDownloadButton({
  href,
  filename,
  chartTitle,
  discipline,
}: ChartDownloadButtonProps) {
  const handleClick = () => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "wallchart_download", {
        chart_name: chartTitle,
        discipline,
      });
    }
  };

  return (
    <a
      href={href}
      download={filename}
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-[0.2em] px-6 py-3 rounded-full transition-colors"
    >
      Download the A4 PDF
    </a>
  );
}