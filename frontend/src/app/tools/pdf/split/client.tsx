"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scissors, Download, Loader2 } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import { CATEGORY_META } from "@/lib/tools";
import { downloadBlobFromApi, parseApiBlobError } from "@/lib/api";

export default function SplitClient() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"extract" | "each">("extract");
  const [pages, setPages] = useState("1-2");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSplit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);
    formData.append("pages", pages);
    try {
      const fallback = mode === "each" ? "split.zip" : "extracted.pdf";
      await downloadBlobFromApi("/api/pdfs/split", formData, fallback);
    } catch (err) {
      setError(await parseApiBlobError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.pdf.label, CATEGORY_META.pdf.href, "Split PDF")}
      title="Split PDF"
      description="Extract specific pages or split every page into separate files."
      icon={<Scissors className="h-10 w-10 text-rose-500" />}
      colorTheme="rose"
      privacyMode="server"
      fileLimit="50 MB"
    >
      <div className="glass-panel rounded-3xl overflow-hidden">
        <PdfUploadZone file={file} onFileSelect={(f) => { setFile(f); setError(null); }} />
        <div className="p-6 md:p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-rose-500">Split mode</label>
            <select value={mode} onChange={(e) => setMode(e.target.value as "extract" | "each")} className="w-full h-11 px-3 rounded-xl border border-black/10 dark:border-white/15 bg-transparent text-sm">
              <option value="extract">Extract page range (single PDF)</option>
              <option value="each">Split every page (ZIP)</option>
            </select>
          </div>
          {mode === "extract" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-rose-500">Pages (e.g. 1-3,5,7)</label>
              <Input value={pages} onChange={(e) => setPages(e.target.value)} placeholder="1-3,5,7" className="h-11 rounded-xl border-black/10 dark:border-white/15" />
            </div>
          )}
        </div>
        {error && <div className="p-4 bg-destructive/10 text-destructive text-center text-sm border-t border-destructive/20">{error}</div>}
        <div className="p-8 flex justify-center border-t dark:border-white/5 border-black/5">
          <Button size="lg" className="h-14 px-10 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white border-0 gap-2" onClick={handleSplit} disabled={loading || !file}>
            {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Splitting...</> : <><Download className="h-5 w-5" /> Download</>}
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
