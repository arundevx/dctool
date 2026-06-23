"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2 } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import { CATEGORY_META } from "@/lib/tools";
import { downloadBlobFromApi, parseApiBlobError } from "@/lib/api";

export default function PdfToTextClient() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const base = file.name.replace(/\.pdf$/i, "") || "document";
      await downloadBlobFromApi("/api/pdfs/to-text", formData, `${base}.txt`);
    } catch (err) {
      setError(await parseApiBlobError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.pdf.label, CATEGORY_META.pdf.href, "PDF to Text")}
      title="PDF to Text"
      description="Extract readable text from your PDF and download it as a plain text file."
      icon={<FileText className="h-10 w-10 text-rose-500" />}
      colorTheme="rose"
      privacyMode="server"
      fileLimit="50 MB"
    >
      <div className="glass-panel rounded-3xl overflow-hidden">
        <PdfUploadZone file={file} onFileSelect={(f) => { setFile(f); setError(null); }} />
        <p className="px-6 pb-2 text-sm text-muted-foreground text-center">
          Works best on text-based PDFs. Scanned image PDFs may not contain extractable text.
        </p>
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive text-center text-sm border-t border-destructive/20">
            {error}
          </div>
        )}
        <div className="p-8 flex justify-center border-t dark:border-white/5 border-black/5">
          <Button
            size="lg"
            className="h-14 px-10 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white border-0 gap-2"
            onClick={handleExtract}
            disabled={loading || !file}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Extracting...
              </>
            ) : (
              <>
                <Download className="h-5 w-5" /> Download TXT
              </>
            )}
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
