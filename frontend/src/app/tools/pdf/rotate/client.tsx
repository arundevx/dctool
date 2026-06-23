"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCw, Download, Loader2 } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import { CATEGORY_META } from "@/lib/tools";
import { downloadBlobFromApi, parseApiBlobError } from "@/lib/api";

const ANGLES = [
  { value: 90, label: "90° clockwise" },
  { value: 180, label: "180°" },
  { value: 270, label: "270° clockwise" },
];

export default function PdfRotateClient() {
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState(90);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRotate = async () => {
    if (!file) {
      setError("Upload a PDF file first.");
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("angle", String(angle));
    try {
      await downloadBlobFromApi("/api/pdfs/rotate", formData, "rotated.pdf");
    } catch (err) {
      setError(await parseApiBlobError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.pdf.label, CATEGORY_META.pdf.href, "Rotate PDF")}
      title="Rotate PDF"
      description="Rotate every page in your PDF by 90°, 180°, or 270°."
      icon={<RotateCw className="h-10 w-10 text-rose-500" />}
      colorTheme="rose"
      privacyMode="server"
      fileLimit="50 MB"
      maxWidth="4xl"
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
        <PdfUploadZone file={file} onFileSelect={(f) => { setFile(f); setError(null); }} />

        <div className="space-y-2">
          <label className="text-sm font-medium text-rose-500">Rotation angle</label>
          <select
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full h-11 px-3 rounded-xl border border-black/10 dark:border-white/15 bg-transparent text-sm"
          >
            {ANGLES.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button onClick={handleRotate} disabled={!file || loading} className="w-full h-12 rounded-xl gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {loading ? "Rotating..." : "Download Rotated PDF"}
        </Button>
      </div>
    </ToolLayout>
  );
}
