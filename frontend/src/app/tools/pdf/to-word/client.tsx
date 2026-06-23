"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileType, Download, Loader2 } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import { CATEGORY_META } from "@/lib/tools";
import { downloadBlobFromApi, parseApiBlobError } from "@/lib/api";

export default function ToWordClient() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await downloadBlobFromApi("/api/pdfs/to-word", formData, "converted.docx");
    } catch (err) {
      setError(await parseApiBlobError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.pdf.label, CATEGORY_META.pdf.href, "PDF to Word")}
      title="PDF to Word"
      description="Convert your PDF into an editable Word document (.docx)."
      icon={<FileType className="h-10 w-10 text-rose-500" />}
      colorTheme="rose"
      privacyMode="server"
      fileLimit="50 MB"
    >
      <div className="glass-panel rounded-3xl overflow-hidden">
        <PdfUploadZone file={file} onFileSelect={(f) => { setFile(f); setError(null); }} />
        <p className="px-6 pb-2 text-sm text-muted-foreground text-center">Best for text-based PDFs. Scanned PDFs may need OCR.</p>
        {error && <div className="p-4 bg-destructive/10 text-destructive text-center text-sm border-t border-destructive/20">{error}</div>}
        <div className="p-8 flex justify-center border-t dark:border-white/5 border-black/5">
          <Button size="lg" className="h-14 px-10 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white border-0 gap-2" onClick={handleConvert} disabled={loading || !file}>
            {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Converting...</> : <><Download className="h-5 w-5" /> Download DOCX</>}
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
