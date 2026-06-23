"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Undo2 } from "lucide-react";
import { fitCanvasSize } from "@/lib/image-preview";

export interface RedactRegion {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface ImageRedactCanvasProps {
  image: HTMLImageElement | null;
  mode: "blur" | "solid";
  blurRadius: number;
  brushSize: number;
  onRegionsChange: (regions: RedactRegion[]) => void;
}

export function ImageRedactCanvas({
  image,
  mode,
  blurRadius,
  brushSize,
  onRegionsChange,
}: ImageRedactCanvasProps) {
  const displayRef = useRef<HTMLCanvasElement>(null);
  const workRef = useRef<HTMLCanvasElement | null>(null);
  const regionsRef = useRef<RedactRegion[]>([]);
  const strokeRef = useRef<RedactRegion[]>([]);
  const paintingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 });
  const [stampCount, setStampCount] = useState(0);

  const applyRegion = useCallback(
    (ctx: CanvasRenderingContext2D, source: HTMLCanvasElement, region: RedactRegion) => {
      const { left, top, width, height } = region;
      if (width < 1 || height < 1) return;

      if (mode === "solid") {
        ctx.fillStyle = "#000000";
        ctx.fillRect(left, top, width, height);
        return;
      }

      const patch = document.createElement("canvas");
      patch.width = width;
      patch.height = height;
      const pctx = patch.getContext("2d");
      if (!pctx) return;
      pctx.drawImage(source, left, top, width, height, 0, 0, width, height);

      const blurred = document.createElement("canvas");
      blurred.width = width;
      blurred.height = height;
      const bctx = blurred.getContext("2d");
      if (!bctx) return;
      bctx.filter = `blur(${blurRadius}px)`;
      bctx.drawImage(patch, 0, 0);
      ctx.drawImage(blurred, 0, 0, width, height, left, top, width, height);
    },
    [mode, blurRadius]
  );

  const rebuildWorkCanvas = useCallback(
    (regionList: RedactRegion[]) => {
      if (!image) return null;
      const work = workRef.current ?? document.createElement("canvas");
      work.width = image.naturalWidth;
      work.height = image.naturalHeight;
      workRef.current = work;
      const wctx = work.getContext("2d");
      if (!wctx) return null;

      wctx.drawImage(image, 0, 0);
      for (const region of regionList) {
        applyRegion(wctx, work, region);
      }
      return work;
    },
    [image, applyRegion]
  );

  const paintDisplay = useCallback(
    (work: HTMLCanvasElement) => {
      const display = displayRef.current;
      if (!display || !image) return;

      const { width: dw, height: dh } = fitCanvasSize(
        image.naturalWidth,
        image.naturalHeight,
        640,
        520
      );
      setDisplaySize({ w: dw, h: dh });
      display.width = dw;
      display.height = dh;
      const dctx = display.getContext("2d");
      if (!dctx) return;
      dctx.drawImage(work, 0, 0, dw, dh);
    },
    [image]
  );

  const commitRegions = useCallback(
    (regionList: RedactRegion[]) => {
      regionsRef.current = regionList;
      setStampCount(regionList.length);
      onRegionsChange(regionList);
      const work = rebuildWorkCanvas(regionList);
      if (work) paintDisplay(work);
    },
    [rebuildWorkCanvas, paintDisplay, onRegionsChange]
  );

  useEffect(() => {
    if (!image) {
      regionsRef.current = [];
      strokeRef.current = [];
      setStampCount(0);
      onRegionsChange([]);
      return;
    }
    commitRegions([]);
  }, [image, mode, blurRadius, commitRegions, onRegionsChange]);

  const makeStamp = (ix: number, iy: number): RedactRegion | null => {
    if (!image) return null;
    const half = brushSize / 2;
    const left = Math.max(0, Math.round(ix - half));
    const top = Math.max(0, Math.round(iy - half));
    const width = Math.min(brushSize, image.naturalWidth - left);
    const height = Math.min(brushSize, image.naturalHeight - top);
    if (width < 2 || height < 2) return null;
    return { left, top, width, height };
  };

  const applyStampLive = (ix: number, iy: number) => {
    const region = makeStamp(ix, iy);
    if (!region || !workRef.current) return;
    strokeRef.current.push(region);
    const wctx = workRef.current.getContext("2d");
    if (!wctx) return;
    applyRegion(wctx, workRef.current, region);
    paintDisplay(workRef.current);
  };

  const paintLine = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dist = Math.hypot(to.x - from.x, to.y - from.y);
    const step = Math.max(brushSize * 0.35, 4);
    const steps = Math.max(1, Math.ceil(dist / step));
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      applyStampLive(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t);
    }
  };

  const toImageCoords = (clientX: number, clientY: number) => {
    const canvas = displayRef.current;
    if (!canvas || !image) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * image.naturalWidth,
      y: ((clientY - rect.top) / rect.height) * image.naturalHeight,
    };
  };

  const endStroke = () => {
    if (strokeRef.current.length === 0) return;
    commitRegions([...regionsRef.current, ...strokeRef.current]);
    strokeRef.current = [];
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!image) return;
    e.preventDefault();
    if (!workRef.current) rebuildWorkCanvas(regionsRef.current);
    paintingRef.current = true;
    strokeRef.current = [];
    const pt = toImageCoords(e.clientX, e.clientY);
    if (!pt) return;
    lastPointRef.current = pt;
    applyStampLive(pt.x, pt.y);
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!paintingRef.current || !image) return;
    const pt = toImageCoords(e.clientX, e.clientY);
    if (!pt || !lastPointRef.current) return;
    paintLine(lastPointRef.current, pt);
    lastPointRef.current = pt;
  };

  const handlePointerUp = () => {
    if (!paintingRef.current) return;
    paintingRef.current = false;
    lastPointRef.current = null;
    endStroke();
  };

  const handleUndo = () => {
    const trimmed = regionsRef.current.slice(0, -12);
    strokeRef.current = [];
    commitRegions(trimmed);
  };

  const handleClear = () => {
    strokeRef.current = [];
    commitRegions([]);
  };

  if (!image) {
    return <p className="text-sm text-muted-foreground text-center py-8">Upload an image to paint blur regions</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground text-center">
        Click and drag over areas to {mode === "blur" ? "blur" : "black out"}
      </p>
      <div className="flex justify-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={handleUndo} disabled={stampCount === 0} className="gap-1.5">
          <Undo2 className="h-3.5 w-3.5" />
          Undo
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={handleClear} disabled={stampCount === 0} className="gap-1.5">
          <Eraser className="h-3.5 w-3.5" />
          Clear all
        </Button>
      </div>
      <div className="flex justify-center overflow-auto">
        <canvas
          ref={displayRef}
          className="max-w-full rounded-lg border border-black/10 shadow-sm cursor-crosshair touch-none"
          style={{ width: displaySize.w || undefined, height: displaySize.h || undefined }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>
      {stampCount > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {stampCount} brush stamp{stampCount === 1 ? "" : "s"} applied
        </p>
      )}
    </div>
  );
}
