"use client";

import React, { useEffect, useRef, useState } from "react";
import type { WatermarkPosition } from "@/lib/image-preview";
import { drawCanvasWatermark, fitCanvasSize } from "@/lib/image-preview";

interface PdfWatermarkPreviewProps {
  file: File | null;
  text: string;
  position: WatermarkPosition;
  opacity: number;
  fontSize: number;
  color?: string;
}

export function PdfWatermarkPreview({
  file,
  text,
  position,
  opacity,
  fontSize,
  color = "#e11d48",
}: PdfWatermarkPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const pdfFile = file;
    if (!canvas || !pdfFile) {
      setPageCount(0);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setPreviewError(null);

    async function render(pdfFile: File, targetCanvas: HTMLCanvasElement) {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        if (cancelled) return;

        setPageCount(pdf.numPages);
        const page = await pdf.getPage(1);
        if (cancelled) return;

        const viewport = page.getViewport({ scale: 1 });
        const { width: cw, height: ch, scale } = fitCanvasSize(
          viewport.width,
          viewport.height,
          520,
          400
        );

        targetCanvas.width = cw;
        targetCanvas.height = ch;
        const ctx = targetCanvas.getContext("2d");
        if (!ctx) return;

        const scaledViewport = page.getViewport({ scale });
        await page.render({ canvasContext: ctx, viewport: scaledViewport, canvas: targetCanvas }).promise;
        if (cancelled) return;

        if (text.trim()) {
          const scaledFont = Math.max(10, fontSize * scale);
          drawCanvasWatermark(
            ctx,
            text,
            cw,
            ch,
            position,
            scaledFont,
            color,
            opacity,
            Math.round(36 * scale)
          );
        }
      } catch {
        if (!cancelled) {
          setPreviewError("Could not render PDF preview.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    render(pdfFile, canvas);
    return () => {
      cancelled = true;
    };
  }, [file, text, position, opacity, fontSize, color]);

  if (!file) {
    return <p className="text-sm text-muted-foreground">Upload a PDF to see preview</p>;
  }

  if (previewError) {
    return <p className="text-sm text-destructive">{previewError}</p>;
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {loading && (
        <p className="text-xs text-muted-foreground">Loading preview...</p>
      )}
      <canvas
        ref={canvasRef}
        className="max-w-full rounded-lg border border-black/10 shadow-sm bg-white"
      />
      {pageCount > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Previewing page 1 of {pageCount}. Watermark applies to all pages.
        </p>
      )}
    </div>
  );
}
