"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { GripVertical, RotateCcw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PageThumb {
  originalPageNum: number;
  dataUrl: string;
}

interface PdfPageReorderGridProps {
  file: File | null;
  onOrderChange: (pageOrder: string, pageCount: number) => void;
}

async function renderPdfThumbnails(file: File): Promise<PageThumb[]> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const thumbs: PageThumb[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = Math.min(160 / baseViewport.width, 220 / baseViewport.height, 0.45);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    thumbs.push({
      originalPageNum: i,
      dataUrl: canvas.toDataURL("image/jpeg", 0.75),
    });
  }

  return thumbs;
}

export function PdfPageReorderGrid({ file, onOrderChange }: PdfPageReorderGridProps) {
  const [pages, setPages] = useState<PageThumb[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const dragIndex = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!file) {
      setPages([]);
      setLoadError(null);
      onOrderChange("", 0);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    renderPdfThumbnails(file)
      .then((thumbs) => {
        if (cancelled) return;
        setPages(thumbs);
        onOrderChange(
          thumbs.map((t) => t.originalPageNum).join(","),
          thumbs.length
        );
      })
      .catch(() => {
        if (!cancelled) setLoadError("Could not load PDF pages for preview.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [file, onOrderChange]);

  const notifyOrder = useCallback(
    (next: PageThumb[]) => {
      onOrderChange(
        next.map((p) => p.originalPageNum).join(","),
        next.length
      );
    },
    [onOrderChange]
  );

  const movePage = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= pages.length || to >= pages.length) return;
    setPages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      notifyOrder(next);
      return next;
    });
  };

  const resetOrder = () => {
    setPages((prev) => {
      const next = [...prev].sort((a, b) => a.originalPageNum - b.originalPageNum);
      notifyOrder(next);
      return next;
    });
  };

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (dropIndex: number) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    setDragOverIndex(null);
    if (from !== null) movePage(from, dropIndex);
  };

  const handleDragEnd = () => {
    dragIndex.current = null;
    setDragOverIndex(null);
  };

  if (!file) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Upload a PDF to preview and drag pages into order.
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
        <p className="text-sm">Generating page previews...</p>
      </div>
    );
  }

  if (loadError) {
    return <p className="text-sm text-destructive text-center py-6">{loadError}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Drag pages to reorder · {pages.length} page{pages.length !== 1 ? "s" : ""}
        </p>
        <Button type="button" variant="outline" size="sm" onClick={resetOrder} className="gap-1.5 rounded-lg">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset order
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[520px] overflow-y-auto pr-1">
        {pages.map((page, index) => (
          <div
            key={`page-${page.originalPageNum}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
            className={cn(
              "group relative rounded-xl border-2 bg-white dark:bg-zinc-900 overflow-hidden cursor-grab active:cursor-grabbing transition-all",
              dragOverIndex === index
                ? "border-rose-500 scale-[1.02] shadow-lg"
                : "border-black/10 dark:border-white/15 hover:border-rose-400/50"
            )}
          >
            <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-500 text-white shadow">
                #{index + 1}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/60 text-white">
                was {page.originalPageNum}
              </span>
            </div>
            <div className="absolute top-2 right-2 z-10 p-1 rounded-md bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-4 w-4" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={page.dataUrl}
              alt={`Page ${page.originalPageNum}`}
              className="w-full aspect-[3/4] object-contain bg-muted/30 pointer-events-none"
              draggable={false}
            />
            <div className="flex border-t border-black/5 dark:border-white/10 sm:hidden">
              <button
                type="button"
                className="flex-1 text-xs py-2 hover:bg-muted/50 disabled:opacity-30"
                disabled={index === 0}
                onClick={() => movePage(index, index - 1)}
              >
                ←
              </button>
              <button
                type="button"
                className="flex-1 text-xs py-2 hover:bg-muted/50 disabled:opacity-30"
                disabled={index === pages.length - 1}
                onClick={() => movePage(index, index + 1)}
              >
                →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
