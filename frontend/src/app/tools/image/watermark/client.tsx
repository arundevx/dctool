"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stamp, Download, Loader2 } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { ImageUploadZone } from "@/components/tools/image-upload-zone";
import {
  PreviewPanel,
  useLoadedImage,
  WatermarkPreview,
} from "@/components/tools/image-tool-preview";
import type { WatermarkPosition } from "@/lib/image-preview";
import { WATERMARK_POSITIONS } from "@/lib/image-preview";
import { CATEGORY_META } from "@/lib/tools";
import { downloadBlobFromApi, parseApiBlobError } from "@/lib/api";

export default function WatermarkClient() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("© DreamConsole");
  const [position, setPosition] = useState<WatermarkPosition>("bottom-right");
  const [opacity, setOpacity] = useState(50);
  const [fontSize, setFontSize] = useState(36);
  const [color, setColor] = useState("#FFFFFF");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { image } = useLoadedImage(file);

  const handleWatermark = async () => {
    if (!file || !text.trim()) {
      setError("Please upload an image and enter watermark text.");
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("text", text.trim());
    formData.append("position", position);
    formData.append("opacity", String(opacity));
    formData.append("font_size", String(fontSize));
    formData.append("color", color);

    try {
      await downloadBlobFromApi("/api/images/watermark", formData, `watermarked_${file.name}`);
    } catch (err) {
      setError(await parseApiBlobError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.image.label, CATEGORY_META.image.href, "Watermark Image")}
      title="Add Watermark"
      description="Protect your images with a customizable text watermark."
      icon={<Stamp className="h-10 w-10 text-blue-500" />}
      colorTheme="blue"
      privacyMode="server"
      fileLimit="10 MB"
      maxWidth="6xl"
    >
      <div className="glass-panel rounded-3xl overflow-hidden">
        <ImageUploadZone file={file} onFileSelect={(f) => { setFile(f); setError(null); }} />

        <div className="grid lg:grid-cols-2 gap-0 border-t dark:border-white/5 border-black/5">
          <div className="p-6 md:p-8 space-y-5 border-b lg:border-b-0 lg:border-r dark:border-white/5 border-black/5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-500">Watermark text</label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="© Your Name"
                className="h-11 rounded-xl border-black/10 dark:border-white/15"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-500">Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as WatermarkPosition)}
                  className="w-full h-11 px-3 rounded-xl border border-black/10 dark:border-white/15 bg-transparent text-sm"
                >
                  {WATERMARK_POSITIONS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-500">Text color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-11 w-14 rounded-xl border border-black/10 dark:border-white/15 cursor-pointer"
                  />
                  <Input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-11 rounded-xl border-black/10 dark:border-white/15 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-500">Opacity: {opacity}%</label>
              <input
                type="range"
                min={10}
                max={100}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-500">Font size: {fontSize}px</label>
              <input
                type="range"
                min={12}
                max={120}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          </div>

          <div className="p-6 md:p-8">
            <PreviewPanel title="Live preview" subtitle="See how your watermark will look">
              <WatermarkPreview
                image={image}
                text={text}
                position={position}
                opacity={opacity}
                fontSize={fontSize}
                color={color}
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
            onClick={handleWatermark}
            disabled={loading || !file}
          >
            {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Applying...</> : <><Download className="h-5 w-5" /> Download Watermarked Image</>}
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
