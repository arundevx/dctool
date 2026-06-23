"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Maximize2, Download, Loader2 } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { ImageUploadZone, useImageDimensions } from "@/components/tools/image-upload-zone";
import {
  PreviewPanel,
  ResizePreview,
  useLoadedImage,
} from "@/components/tools/image-tool-preview";
import { CATEGORY_META } from "@/lib/tools";
import { downloadBlobFromApi, parseApiBlobError } from "@/lib/api";

export default function ResizeClient() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dimensions = useImageDimensions(file);
  const { image } = useLoadedImage(file);

  const parsedWidth = parseInt(width, 10) || 0;
  const parsedHeight = parseInt(height, 10) || 0;

  React.useEffect(() => {
    if (dimensions) {
      setWidth(String(dimensions.width));
      setHeight(String(dimensions.height));
    }
  }, [dimensions]);

  const handleResize = async () => {
    if (!file) return;
    if (!parsedWidth || !parsedHeight || parsedWidth < 1 || parsedHeight < 1) {
      setError("Enter valid width and height.");
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("width", String(parsedWidth));
    formData.append("height", String(parsedHeight));
    formData.append("maintain_aspect", String(maintainAspect));

    try {
      await downloadBlobFromApi("/api/images/resize", formData, `resized_${file.name}`);
    } catch (err) {
      setError(await parseApiBlobError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.image.label, CATEGORY_META.image.href, "Resize Image")}
      title="Resize Image"
      description="Change image dimensions while optionally keeping the original aspect ratio."
      icon={<Maximize2 className="h-10 w-10 text-blue-500" />}
      colorTheme="blue"
      privacyMode="server"
      fileLimit="10 MB"
      maxWidth="6xl"
    >
      <div className="glass-panel rounded-3xl overflow-hidden">
        <ImageUploadZone file={file} onFileSelect={(f) => { setFile(f); setError(null); }} />

        <div className="grid lg:grid-cols-2 gap-0 lg:gap-0 border-t dark:border-white/5 border-black/5">
          <div className="p-6 md:p-8 space-y-5 border-b lg:border-b-0 lg:border-r dark:border-white/5 border-black/5">
            {dimensions && (
              <p className="text-sm text-muted-foreground">
                Original: {dimensions.width} × {dimensions.height} px
              </p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-500">Width (px)</label>
                <Input
                  type="number"
                  min={1}
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="h-11 rounded-xl border-black/10 dark:border-white/15"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-500">Height (px)</label>
                <Input
                  type="number"
                  min={1}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="h-11 rounded-xl border-black/10 dark:border-white/15"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={maintainAspect}
                onChange={(e) => setMaintainAspect(e.target.checked)}
                className="rounded accent-blue-500"
              />
              Maintain aspect ratio
            </label>
          </div>

          <div className="p-6 md:p-8">
            <PreviewPanel title="Live preview" subtitle="Preview updates as you change settings">
              <ResizePreview
                image={image}
                width={parsedWidth}
                height={parsedHeight}
                maintainAspect={maintainAspect}
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
            size="lg"
            className="h-14 px-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 gap-2"
            onClick={handleResize}
            disabled={loading || !file}
          >
            {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Resizing...</> : <><Download className="h-5 w-5" /> Download Resized Image</>}
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
