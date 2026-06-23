"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stamp, Download, Loader2 } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import { PdfWatermarkPreview } from "@/components/tools/pdf-watermark-preview";
import { PreviewPanel } from "@/components/tools/image-tool-preview";
import type { WatermarkPosition } from "@/lib/image-preview";
import { WATERMARK_POSITIONS } from "@/lib/image-preview";
import { CATEGORY_META } from "@/lib/tools";
import { downloadBlobFromApi, parseApiBlobError } from "@/lib/api";

export default function PdfWatermarkClient() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [position, setPosition] = useState<WatermarkPosition>("bottom-right");
  const [opacity, setOpacity] = useState(30);
  const [fontSize, setFontSize] = useState(36);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWatermark = async () => {
    if (!file || !text.trim()) {
      setError("Upload a PDF and enter watermark text.");
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
    try {
      await downloadBlobFromApi("/api/pdfs/watermark", formData, "watermarked.pdf");
    } catch (err) {
      setError(await parseApiBlobError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.pdf.label, CATEGORY_META.pdf.href, "PDF Watermark")}
      title="PDF Watermark"
      description="Add a text watermark to every page of your PDF."
      icon={<Stamp className="h-10 w-10 text-rose-500" />}
      colorTheme="rose"
      privacyMode="server"
      fileLimit="50 MB"
      maxWidth="6xl"
    >
      <div className="glass-panel rounded-3xl overflow-hidden">
        <PdfUploadZone file={file} onFileSelect={(f) => { setFile(f); setError(null); }} />

        <div className="grid lg:grid-cols-2 border-t dark:border-white/5 border-black/5">
          <div className="p-6 md:p-8 space-y-5 border-b lg:border-b-0 lg:border-r dark:border-white/5 border-black/5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-rose-500">Watermark text</label>
              <Input value={text} onChange={(e) => setText(e.target.value)} className="h-11 rounded-xl border-black/10 dark:border-white/15" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-rose-500">Position</label>
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
              <label className="text-sm font-medium text-rose-500">Opacity: {opacity}%</label>
              <input type="range" min={5} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-rose-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-rose-500">Font size: {fontSize}px</label>
              <input type="range" min={12} max={72} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-rose-500" />
            </div>
          </div>

          <div className="p-6 md:p-8">
            <PreviewPanel title="Live preview" subtitle="Page 1 preview — watermark applies to all pages">
              <PdfWatermarkPreview
                file={file}
                text={text}
                position={position}
                opacity={opacity}
                fontSize={fontSize}
              />
            </PreviewPanel>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive text-center text-sm border-t border-destructive/20">
            {error}
          </div>
        )}

        <div className="p-8 flex justify-center border-t dark:border-white/5 border-black/5">
          <Button
            size="lg"
            className="h-14 px-10 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white border-0 gap-2"
            onClick={handleWatermark}
            disabled={loading || !file}
          >
            {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Applying...</> : <><Download className="h-5 w-5" /> Download PDF</>}
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
