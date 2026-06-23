"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  computeResizeOutput,
  drawCanvasWatermark,
  drawCheckerboard,
  fitCanvasSize,
  type WatermarkPosition,
} from "@/lib/image-preview";
import { cn } from "@/lib/utils";

export function useLoadedImage(file: File | null) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setImage(null);
      setObjectUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    const img = new window.Image();
    img.onload = () => setImage(img);
    img.onerror = () => setImage(null);
    img.src = url;

    return () => URL.revokeObjectURL(url);
  }, [file]);

  return { image, objectUrl };
}

interface PreviewPanelProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function PreviewPanel({ title, subtitle, children, className }: PreviewPanelProps) {
  return (
    <div className={cn("rounded-2xl border border-black/10 dark:border-white/15 bg-white dark:bg-white/[0.03] overflow-hidden", className)}>
      <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
        <p className="text-sm font-semibold">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-4 flex items-center justify-center min-h-[220px] bg-[#f8fafc] dark:bg-black/20">
        {children}
      </div>
    </div>
  );
}

interface ResizePreviewProps {
  image: HTMLImageElement | null;
  width: number;
  height: number;
  maintainAspect: boolean;
}

export function ResizePreview({ image, width, height, maintainAspect }: ResizePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image || width < 1 || height < 1) return;

    const output = computeResizeOutput(image.naturalWidth, image.naturalHeight, width, height, maintainAspect);
    const { width: cw, height: ch } = fitCanvasSize(output.width, output.height, 480, 360);

    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawCheckerboard(ctx, cw, ch);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, output.width, output.height, 0, 0, cw, ch);
  }, [image, width, height, maintainAspect]);

  if (!image) {
    return <p className="text-sm text-muted-foreground">Upload an image to see preview</p>;
  }

  if (width < 1 || height < 1) {
    return <p className="text-sm text-muted-foreground">Enter valid dimensions</p>;
  }

  const output = computeResizeOutput(image.naturalWidth, image.naturalHeight, width, height, maintainAspect);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <canvas ref={canvasRef} className="max-w-full rounded-lg border border-black/10 shadow-sm" />
      <p className="text-xs text-muted-foreground">
        Output: {output.width} × {output.height} px
      </p>
    </div>
  );
}

interface CropPreviewProps {
  image: HTMLImageElement | null;
  left: number;
  top: number;
  cropWidth: number;
  cropHeight: number;
}

export function CropPreview({ image, left, top, cropWidth, cropHeight }: CropPreviewProps) {
  const sourceRef = useRef<HTMLCanvasElement>(null);
  const resultRef = useRef<HTMLCanvasElement>(null);

  const valid =
    image &&
    left >= 0 &&
    top >= 0 &&
    cropWidth >= 1 &&
    cropHeight >= 1 &&
    left + cropWidth <= image.naturalWidth &&
    top + cropHeight <= image.naturalHeight;

  useEffect(() => {
    const sourceCanvas = sourceRef.current;
    const resultCanvas = resultRef.current;
    if (!sourceCanvas || !resultCanvas || !image || !valid) return;

    const { width: sw, height: sh } = fitCanvasSize(image.naturalWidth, image.naturalHeight, 480, 200);
    const scale = sw / image.naturalWidth;
    const cx = left * scale;
    const cy = top * scale;
    const cw = cropWidth * scale;
    const ch = cropHeight * scale;

    sourceCanvas.width = sw;
    sourceCanvas.height = sh;
    const sctx = sourceCanvas.getContext("2d");
    if (!sctx) return;

    sctx.drawImage(image, 0, 0, sw, sh);
    sctx.fillStyle = "rgba(0,0,0,0.45)";
    sctx.fillRect(0, 0, sw, sh);
    sctx.drawImage(image, left, top, cropWidth, cropHeight, cx, cy, cw, ch);
    sctx.strokeStyle = "#3b82f6";
    sctx.lineWidth = 2;
    sctx.strokeRect(cx, cy, cw, ch);

    const { width: rw, height: rh } = fitCanvasSize(cropWidth, cropHeight, 480, 200);
    resultCanvas.width = rw;
    resultCanvas.height = rh;
    const rctx = resultCanvas.getContext("2d");
    if (!rctx) return;

    drawCheckerboard(rctx, rw, rh);
    rctx.imageSmoothingEnabled = true;
    rctx.imageSmoothingQuality = "high";
    rctx.drawImage(image, left, top, cropWidth, cropHeight, 0, 0, rw, rh);
  }, [image, left, top, cropWidth, cropHeight, valid]);

  if (!image) {
    return <p className="text-sm text-muted-foreground">Upload an image to see preview</p>;
  }

  if (!valid) {
    return <p className="text-sm text-destructive">Crop area is outside image bounds</p>;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Selection</p>
        <canvas ref={sourceRef} className="max-w-full rounded-lg border border-black/10 mx-auto block" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Result</p>
        <canvas ref={resultRef} className="max-w-full rounded-lg border border-black/10 mx-auto block" />
        <p className="text-xs text-muted-foreground text-center mt-2">
          Output: {cropWidth} × {cropHeight} px
        </p>
      </div>
    </div>
  );
}

interface WatermarkPreviewProps {
  image: HTMLImageElement | null;
  text: string;
  position: WatermarkPosition;
  opacity: number;
  fontSize: number;
  color: string;
}

export function WatermarkPreview({
  image,
  text,
  position,
  opacity,
  fontSize,
  color,
}: WatermarkPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image || !text.trim()) return;

    const { width: cw, height: ch, scale } = fitCanvasSize(image.naturalWidth, image.naturalHeight, 520, 380);
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawCheckerboard(ctx, cw, ch);
    ctx.drawImage(image, 0, 0, cw, ch);

    const scaledFont = Math.max(10, Math.round(fontSize * scale));
    drawCanvasWatermark(ctx, text, cw, ch, position, scaledFont, color, opacity, Math.round(20 * scale));
  }, [image, text, position, opacity, fontSize, color]);

  if (!image) {
    return <p className="text-sm text-muted-foreground">Upload an image to see preview</p>;
  }

  if (!text.trim()) {
    return <p className="text-sm text-muted-foreground">Enter watermark text</p>;
  }

  return (
    <canvas ref={canvasRef} className="max-w-full rounded-lg border border-black/10 shadow-sm" />
  );
}
