"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crop, Download, Loader2 } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { ImageUploadZone, useImageDimensions } from "@/components/tools/image-upload-zone";
import {
  CropPreview,
  PreviewPanel,
  useLoadedImage,
} from "@/components/tools/image-tool-preview";
import { CATEGORY_META } from "@/lib/tools";
import { downloadBlobFromApi, parseApiBlobError } from "@/lib/api";

export default function CropClient() {
  const [file, setFile] = useState<File | null>(null);
  const [left, setLeft] = useState("0");
  const [top, setTop] = useState("0");
  const [cropWidth, setCropWidth] = useState("");
  const [cropHeight, setCropHeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dimensions = useImageDimensions(file);
  const { image } = useLoadedImage(file);

  const parsedLeft = parseInt(left, 10) || 0;
  const parsedTop = parseInt(top, 10) || 0;
  const parsedCropW = parseInt(cropWidth, 10) || 0;
  const parsedCropH = parseInt(cropHeight, 10) || 0;

  React.useEffect(() => {
    if (dimensions) {
      setCropWidth(String(dimensions.width));
      setCropHeight(String(dimensions.height));
      setLeft("0");
      setTop("0");
    }
  }, [dimensions]);

  const handleCrop = async () => {
    if (!file) return;

    if ([parsedLeft, parsedTop, parsedCropW, parsedCropH].some((v) => v < 0) || parsedCropW < 1 || parsedCropH < 1) {
      setError("Enter valid crop values.");
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("left", String(parsedLeft));
    formData.append("top", String(parsedTop));
    formData.append("crop_width", String(parsedCropW));
    formData.append("crop_height", String(parsedCropH));

    try {
      await downloadBlobFromApi("/api/images/crop", formData, `cropped_${file.name}`);
    } catch (err) {
      setError(await parseApiBlobError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.image.label, CATEGORY_META.image.href, "Crop Image")}
      title="Crop Image"
      description="Trim your image to an exact region using pixel coordinates."
      icon={<Crop className="h-10 w-10 text-blue-500" />}
      colorTheme="blue"
      privacyMode="server"
      fileLimit="10 MB"
      maxWidth="6xl"
    >
      <div className="glass-panel rounded-3xl overflow-hidden">
        <ImageUploadZone file={file} onFileSelect={(f) => { setFile(f); setError(null); }} />

        <div className="grid lg:grid-cols-2 gap-0 border-t dark:border-white/5 border-black/5">
          <div className="p-6 md:p-8 space-y-5 border-b lg:border-b-0 lg:border-r dark:border-white/5 border-black/5">
            {dimensions && (
              <p className="text-sm text-muted-foreground">
                Image size: {dimensions.width} × {dimensions.height} px
              </p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-500">Left (px)</label>
                <Input type="number" min={0} value={left} onChange={(e) => setLeft(e.target.value)} className="h-11 rounded-xl border-black/10 dark:border-white/15" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-500">Top (px)</label>
                <Input type="number" min={0} value={top} onChange={(e) => setTop(e.target.value)} className="h-11 rounded-xl border-black/10 dark:border-white/15" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-500">Width (px)</label>
                <Input type="number" min={1} value={cropWidth} onChange={(e) => setCropWidth(e.target.value)} className="h-11 rounded-xl border-black/10 dark:border-white/15" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-500">Height (px)</label>
                <Input type="number" min={1} value={cropHeight} onChange={(e) => setCropHeight(e.target.value)} className="h-11 rounded-xl border-black/10 dark:border-white/15" />
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <PreviewPanel title="Live preview" subtitle="Blue box shows your crop selection">
              <CropPreview
                image={image}
                left={parsedLeft}
                top={parsedTop}
                cropWidth={parsedCropW}
                cropHeight={parsedCropH}
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
            onClick={handleCrop}
            disabled={loading || !file}
          >
            {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Cropping...</> : <><Download className="h-5 w-5" /> Download Cropped Image</>}
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
