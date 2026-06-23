"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCw, Download, Loader2, FlipHorizontal, FlipVertical } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { ImageUploadZone } from "@/components/tools/image-upload-zone";
import { PreviewPanel, useLoadedImage } from "@/components/tools/image-tool-preview";
import { fitCanvasSize } from "@/lib/image-preview";
import { CATEGORY_META } from "@/lib/tools";
import { downloadBlobFromApi, parseApiBlobError } from "@/lib/api";
import { cn } from "@/lib/utils";

const ACTIONS = [
  { id: "rotate-90", label: "90° Right", icon: RotateCw },
  { id: "rotate-180", label: "180°", icon: RotateCw },
  { id: "rotate-270", label: "90° Left", icon: RotateCw },
  { id: "flip-horizontal", label: "Flip H", icon: FlipHorizontal },
  { id: "flip-vertical", label: "Flip V", icon: FlipVertical },
] as const;

type ActionId = (typeof ACTIONS)[number]["id"];

function applyPreviewTransform(ctx: CanvasRenderingContext2D, action: ActionId, w: number, h: number) {
  switch (action) {
    case "rotate-90":
      ctx.translate(w, 0);
      ctx.rotate(Math.PI / 2);
      break;
    case "rotate-180":
      ctx.translate(w, h);
      ctx.rotate(Math.PI);
      break;
    case "rotate-270":
      ctx.translate(0, h);
      ctx.rotate(-Math.PI / 2);
      break;
    case "flip-horizontal":
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
      break;
    case "flip-vertical":
      ctx.translate(0, h);
      ctx.scale(1, -1);
      break;
  }
}

function RotateFlipPreview({ image, action }: { image: HTMLImageElement | null; action: ActionId }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const isRotated = action.startsWith("rotate-");
    const srcW = image.naturalWidth;
    const srcH = image.naturalHeight;
    const outW = isRotated && action !== "rotate-180" ? srcH : srcW;
    const outH = isRotated && action !== "rotate-180" ? srcW : srcH;

    const { width: cw, height: ch } = fitCanvasSize(outW, outH, 480, 360);
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, cw, ch);
    ctx.save();
    ctx.scale(cw / outW, ch / outH);
    applyPreviewTransform(ctx, action, srcW, srcH);
    ctx.drawImage(image, 0, 0);
    ctx.restore();
  }, [image, action]);

  if (!image) return <p className="text-sm text-muted-foreground">Upload an image to see preview</p>;
  return <canvas ref={canvasRef} className="max-w-full rounded-lg border border-black/10 shadow-sm" />;
}

export default function RotateFlipClient() {
  const [file, setFile] = useState<File | null>(null);
  const [action, setAction] = useState<ActionId>("rotate-90");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { image } = useLoadedImage(file);

  const handleProcess = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("action", action);
    try {
      await downloadBlobFromApi("/api/images/rotate-flip", formData, `${action}_${file.name}`);
    } catch (err) {
      setError(await parseApiBlobError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.image.label, CATEGORY_META.image.href, "Rotate & Flip")}
      title="Rotate & Flip Image"
      description="Rotate 90°, 180°, 270° or flip horizontally and vertically."
      icon={<RotateCw className="h-10 w-10 text-blue-500" />}
      colorTheme="blue"
      privacyMode="server"
      fileLimit="10 MB"
      maxWidth="6xl"
    >
      <div className="glass-panel rounded-3xl overflow-hidden">
        <ImageUploadZone file={file} onFileSelect={(f) => { setFile(f); setError(null); }} />

        <div className="grid lg:grid-cols-2 border-t dark:border-white/5 border-black/5">
          <div className="p-6 md:p-8 space-y-4 border-b lg:border-b-0 lg:border-r dark:border-white/5 border-black/5">
            <p className="text-sm font-medium text-blue-500">Choose transformation</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ACTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAction(id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-colors",
                    action === id
                      ? "border-blue-500 bg-blue-500/10 text-blue-600"
                      : "border-black/10 dark:border-white/15 hover:bg-black/5"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6 md:p-8">
            <PreviewPanel title="Live preview" subtitle="See the result before downloading">
              <RotateFlipPreview image={image} action={action} />
            </PreviewPanel>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive text-center text-sm border-t border-destructive/20">{error}</div>
        )}

        <div className="p-8 flex justify-center border-t dark:border-white/5 border-black/5">
          <Button size="lg" className="h-14 px-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 gap-2" onClick={handleProcess} disabled={loading || !file}>
            {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</> : <><Download className="h-5 w-5" /> Download Image</>}
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
