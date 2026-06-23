"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Download, Loader2 } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import { CATEGORY_META } from "@/lib/tools";
import { downloadBlobFromApi, parseApiBlobError } from "@/lib/api";

export default function ToImagesClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imageFormat, setImageFormat] = useState("png");
  const [dpi, setDpi] = useState(150);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("image_format", imageFormat);
    formData.append("dpi", String(dpi));
    try {
      await downloadBlobFromApi("/api/pdfs/to-images", formData, "pdf_images.zip");
    } catch (err) {
      setError(await parseApiBlobError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.pdf.label, CATEGORY_META.pdf.href, "PDF to Images")}
      title="PDF to Images"
      description="Convert each PDF page to PNG or JPG and download as a ZIP file."
      icon={<ImageIcon className="h-10 w-10 text-rose-500" />}
      colorTheme="rose"
      privacyMode="server"
      fileLimit="50 MB"
    >
      <div className="glass-panel rounded-3xl overflow-hidden">
        <PdfUploadZone file={file} onFileSelect={(f) => { setFile(f); setError(null); }} />
        <div className="p-6 md:p-8 grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-rose-500">Image format</label>
            <select value={imageFormat} onChange={(e) => setImageFormat(e.target.value)} className="w-full h-11 px-3 rounded-xl border border-black/10 dark:border-white/15 bg-transparent text-sm">
              <option value="png">PNG</option>
              <option value="jpeg">JPG</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-rose-500">Quality (DPI): {dpi}</label>
            <input type="range" min={72} max={300} value={dpi} onChange={(e) => setDpi(Number(e.target.value))} className="w-full accent-rose-500 mt-3" />
          </div>
        </div>
        {error && <div className="p-4 bg-destructive/10 text-destructive text-center text-sm border-t border-destructive/20">{error}</div>}
        <div className="p-8 flex justify-center border-t dark:border-white/5 border-black/5">
          <Button size="lg" className="h-14 px-10 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white border-0 gap-2" onClick={handleConvert} disabled={loading || !file}>
            {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Converting...</> : <><Download className="h-5 w-5" /> Download ZIP</>}
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
