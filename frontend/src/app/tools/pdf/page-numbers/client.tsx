"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hash, Download, Loader2 } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import { CATEGORY_META } from "@/lib/tools";
import { downloadBlobFromApi, parseApiBlobError } from "@/lib/api";

const POSITIONS = [
  { value: "bottom-center", label: "Bottom Center" },
  { value: "bottom-right", label: "Bottom Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "top-center", label: "Top Center" },
  { value: "top-right", label: "Top Right" },
  { value: "top-left", label: "Top Left" },
];

export default function PdfPageNumbersClient() {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState("bottom-center");
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddNumbers = async () => {
    if (!file) {
      setError("Upload a PDF file first.");
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("position", position);
    formData.append("start_number", String(startNumber));
    formData.append("font_size", String(fontSize));
    try {
      await downloadBlobFromApi("/api/pdfs/page-numbers", formData, "numbered.pdf");
    } catch (err) {
      setError(await parseApiBlobError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.pdf.label, CATEGORY_META.pdf.href, "Page Numbers")}
      title="Add Page Numbers"
      description="Stamp page numbers on every page of your PDF."
      icon={<Hash className="h-10 w-10 text-rose-500" />}
      colorTheme="rose"
      privacyMode="server"
      fileLimit="50 MB"
      maxWidth="4xl"
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
        <PdfUploadZone file={file} onFileSelect={(f) => { setFile(f); setError(null); }} />

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-rose-500">Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-black/10 dark:border-white/15 bg-transparent text-sm"
            >
              {POSITIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-rose-500">Start number</label>
            <Input
              type="number"
              min={1}
              value={startNumber}
              onChange={(e) => setStartNumber(Number(e.target.value) || 1)}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium text-rose-500">Font size ({fontSize}px)</label>
            <input
              type="range"
              min={8}
              max={48}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button onClick={handleAddNumbers} disabled={!file || loading} className="w-full h-12 rounded-xl gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {loading ? "Processing..." : "Download Numbered PDF"}
        </Button>
      </div>
    </ToolLayout>
  );
}
