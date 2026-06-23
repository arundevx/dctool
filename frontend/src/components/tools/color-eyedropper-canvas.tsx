"use client";

import React, { useEffect, useRef, useState } from "react";
import { Pipette } from "lucide-react";
import { rgbToHex } from "@/lib/text-utils";
import { cn } from "@/lib/utils";

interface ColorEyedropperCanvasProps {
  imageSrc: string | null;
  onPick: (hex: string) => void;
  label?: string;
}

export function ColorEyedropperCanvas({ imageSrc, onPick, label }: ColorEyedropperCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [hoverHex, setHoverHex] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) {
      setReady(false);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      const maxW = 640;
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);
      setReady(true);
    };
    img.onerror = () => setReady(false);
    img.src = imageSrc;

    return () => {
      cancelled = true;
    };
  }, [imageSrc]);

  const sampleAt = (clientX: number, clientY: number, pick: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas || !ready) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((clientY - rect.top) / rect.height) * canvas.height);
    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(r, g, b);
    setHoverHex(hex);
    setCursorPos({ x: clientX - rect.left, y: clientY - rect.top });
    if (pick) onPick(hex);
  };

  if (!imageSrc) {
    return null;
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium">{label}</p>}
      <div className="relative inline-block max-w-full rounded-xl overflow-hidden border border-black/10 dark:border-white/15">
        <canvas
          ref={canvasRef}
          className={cn("max-w-full block", ready && "cursor-crosshair")}
          onMouseMove={(e) => sampleAt(e.clientX, e.clientY, false)}
          onMouseLeave={() => setHoverHex(null)}
          onClick={(e) => sampleAt(e.clientX, e.clientY, true)}
        />
        {hoverHex && (
          <div
            className="pointer-events-none absolute z-10 flex items-center gap-2 px-2 py-1 rounded-md bg-black/75 text-white text-xs font-mono shadow-lg"
            style={{ left: Math.min(cursorPos.x + 12, 200), top: cursorPos.y + 12 }}
          >
            <span className="w-4 h-4 rounded border border-white/30" style={{ backgroundColor: hoverHex }} />
            {hoverHex}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <Pipette className="h-3.5 w-3.5" />
        Click anywhere on the image to pick a color
      </p>
    </div>
  );
}
