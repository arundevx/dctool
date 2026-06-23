"use client";

import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { EyeOff, Download, Loader2 } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { ImageUploadZone } from "@/components/tools/image-upload-zone";
import { PreviewPanel, useLoadedImage } from "@/components/tools/image-tool-preview";
import { ImageRedactCanvas, type RedactRegion } from "@/components/tools/image-redact-canvas";
import { CATEGORY_META } from "@/lib/tools";
import { downloadBlobFromApi, parseApiBlobError } from "@/lib/api";

export default function RedactClient() {
  const [file, setFile] = useState<File | null>(null);
  const [regions, setRegions] = useState<RedactRegion[]>([]);
  const [mode, setMode] = useState<"blur" | "solid">("blur");
  const [blurRadius, setBlurRadius] = useState(20);
  const [brushSize, setBrushSize] = useState(48);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { image } = useLoadedImage(file);

  const handleRegionsChange = useCallback((r: RedactRegion[]) => {
    setRegions(r);
  }, []);

  const handleRedact = async () => {
    if (!file || regions.length === 0) {
      setError("Upload an image and paint over the areas you want to blur or hide.");
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("regions", JSON.stringify(regions));
    formData.append("mode", mode);
    formData.append("blur_radius", String(blurRadius));
    try {
      await downloadBlobFromApi("/api/images/redact", formData, `redacted_${file.name}`);
    } catch (err) {
      setError(await parseApiBlobError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.image.label, CATEGORY_META.image.href, "Blur / Redact")}
      title="Blur & Redact Region"
      description="Paint over faces or sensitive areas with your mouse to blur or hide them."
      icon={<EyeOff className="h-10 w-10 text-blue-500" />}
      colorTheme="blue"
      privacyMode="server"
      fileLimit="10 MB"
      maxWidth="6xl"
      toolHref="/tools/image/redact"
    >
      <div className="glass-panel rounded-3xl overflow-hidden">
        <ImageUploadZone file={file} onFileSelect={(f) => { setFile(f); setError(null); setRegions([]); }} />

        <div className="grid lg:grid-cols-2 gap-0 border-t dark:border-white/5 border-black/5">
          <div className="p-6 md:p-8 space-y-5 border-b lg:border-b-0 lg:border-r dark:border-white/5 border-black/5">
            <div className="flex flex-wrap gap-2">
              <Button variant={mode === "blur" ? "default" : "outline"} size="sm" onClick={() => setMode("blur")}>
                Blur
              </Button>
              <Button variant={mode === "solid" ? "default" : "outline"} size="sm" onClick={() => setMode("solid")}>
                Solid black
              </Button>
            </div>
            {mode === "blur" && (
              <div className="space-y-1">
                <label className="text-sm font-medium">Blur strength ({blurRadius})</label>
                <input
                  type="range"
                  min={5}
                  max={50}
                  value={blurRadius}
                  onChange={(e) => setBlurRadius(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium">Brush size ({brushSize}px)</label>
              <input
                type="range"
                min={16}
                max={120}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          </div>

          <div className="p-6 md:p-8">
            <PreviewPanel title="Paint to redact" subtitle="Drag over the image to mark areas">
              <ImageRedactCanvas
                image={image}
                mode={mode}
                blurRadius={blurRadius}
                brushSize={brushSize}
                onRegionsChange={handleRegionsChange}
              />
            </PreviewPanel>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive text-center text-sm font-medium border-t border-destructive/20">
            {error}
          </div>
        )}

        <div className="p-8 flex justify-center border-t dark:border-white/5 border-black/5">
          <Button
            onClick={handleRedact}
            disabled={!file || regions.length === 0 || loading}
            className="h-14 px-10 rounded-full gap-2"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
            Download Redacted Image
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
