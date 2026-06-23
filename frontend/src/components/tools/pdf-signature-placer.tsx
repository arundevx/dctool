"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { fitCanvasSize } from "@/lib/image-preview";

export interface SignaturePlacement {
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PdfSignaturePlacerProps {
  pdfFile: File | null;
  signatureFile: File | null;
  signatureWidth: number;
  signatureHeight: number;
  onPlacementChange: (placement: SignaturePlacement | null) => void;
}

export function PdfSignaturePlacer({
  pdfFile,
  signatureFile,
  signatureWidth,
  signatureHeight,
  onPlacementChange,
}: PdfSignaturePlacerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [pageSize, setPageSize] = useState({ w: 0, h: 0 });
  const [sigUrl, setSigUrl] = useState<string | null>(null);
  const [sigPos, setSigPos] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const sigDisplayW = signatureWidth * scale;
  const sigDisplayH = signatureHeight * scale;

  const clampPos = (x: number, y: number) => ({
    x: Math.max(0, Math.min(x, canvasSize.w - sigDisplayW)),
    y: Math.max(0, Math.min(y, canvasSize.h - sigDisplayH)),
  });

  useEffect(() => {
    if (!signatureFile) {
      setSigUrl(null);
      return;
    }
    const url = URL.createObjectURL(signatureFile);
    setSigUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [signatureFile]);

  useEffect(() => {
    if (!pdfFile || scale <= 0 || canvasSize.w <= 0) {
      onPlacementChange(null);
      return;
    }
    onPlacementChange({
      pageNumber: currentPage,
      x: Math.round(sigPos.x / scale),
      y: Math.round(sigPos.y / scale),
      width: signatureWidth,
      height: signatureHeight,
    });
  }, [
    pdfFile,
    sigPos,
    scale,
    currentPage,
    signatureWidth,
    signatureHeight,
    canvasSize.w,
    onPlacementChange,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pdfFile) {
      setPageCount(0);
      setCanvasSize({ w: 0, h: 0 });
      setScale(1);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

        const pdf = await pdfjs.getDocument({ data: await pdfFile.arrayBuffer() }).promise;
        if (cancelled) return;

        setPageCount(pdf.numPages);
        const pageNum = Math.min(currentPage, pdf.numPages);
        const page = await pdf.getPage(pageNum);
        if (cancelled) return;

        const viewport = page.getViewport({ scale: 1 });
        setPageSize({ w: viewport.width, h: viewport.height });

        const fitted = fitCanvasSize(viewport.width, viewport.height, 640, 720);
        setScale(fitted.scale);
        setCanvasSize({ w: fitted.width, h: fitted.height });

        // Canvas must stay mounted — re-read ref after state updates may have painted
        const target = canvasRef.current;
        if (!target || cancelled) return;

        target.width = fitted.width;
        target.height = fitted.height;
        const ctx = target.getContext("2d");
        if (!ctx) return;

        const scaledViewport = page.getViewport({ scale: fitted.scale });
        await page.render({ canvasContext: ctx, viewport: scaledViewport, canvas: target }).promise;
        if (cancelled) return;

        const sigW = signatureWidth * fitted.scale;
        const sigH = signatureHeight * fitted.scale;
        setSigPos({
          x: Math.max(0, fitted.width - sigW - 24),
          y: Math.max(0, fitted.height - sigH - 24),
        });
      } catch {
        if (!cancelled) setError("Could not render PDF preview.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfFile, currentPage]);

  useEffect(() => {
    if (canvasSize.w <= 0) return;
    setSigPos((prev) => clampPos(prev.x, prev.y));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signatureWidth, signatureHeight, scale, canvasSize.w, canvasSize.h]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: sigPos.x,
      origY: sigPos.y,
    };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setSigPos(clampPos(dragRef.current.origX + dx, dragRef.current.origY + dy));
    };
    const onUp = () => {
      dragRef.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasSize.w, canvasSize.h, sigDisplayW, sigDisplayH]);

  if (!pdfFile) {
    return <p className="text-sm text-muted-foreground text-center py-6">Upload a PDF to position your signature.</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive text-center py-6">{error}</p>;
  }

  return (
    <div className="space-y-4">
      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-lg"
            disabled={currentPage <= 1 || loading}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {pageCount}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-lg"
            disabled={currentPage >= pageCount || loading}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <p className="text-sm text-muted-foreground text-center">
        {sigUrl ? "Drag the signature to place it on the page" : "Upload a signature image to place it on the PDF"}
      </p>

      <div className="flex justify-center overflow-auto">
        <div
          className="relative inline-block rounded-lg border border-black/10 shadow-sm bg-white"
          style={{ width: canvasSize.w || undefined, height: canvasSize.h || undefined, minWidth: 200, minHeight: 260 }}
        >
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/80 rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
              <p className="text-sm text-muted-foreground">Loading preview...</p>
            </div>
          )}
          <canvas ref={canvasRef} className="block max-w-full" />
          {sigUrl && canvasSize.w > 0 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sigUrl}
              alt="Signature"
              draggable={false}
              onMouseDown={handleMouseDown}
              className="absolute select-none touch-none border-2 border-dashed border-rose-400/80 rounded shadow-lg cursor-move object-fill"
              style={{
                left: sigPos.x,
                top: sigPos.y,
                width: sigDisplayW,
                height: sigDisplayH,
              }}
            />
          )}
        </div>
      </div>

      {pageSize.w > 0 && scale > 0 && (
        <p className="text-xs text-muted-foreground text-center font-mono">
          Position: {Math.round(sigPos.x / scale)}×{Math.round(sigPos.y / scale)} pt · Page {currentPage}
        </p>
      )}
    </div>
  );
}
