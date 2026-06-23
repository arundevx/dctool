"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download, Loader2 } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import { PdfPageReorderGrid } from "@/components/tools/pdf-page-reorder-grid";
import { CATEGORY_META } from "@/lib/tools";
import { downloadBlobFromApi, parseApiBlobError } from "@/lib/api";

export default function ReorderPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageOrder, setPageOrder] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOrderChange = useCallback((order: string, count: number) => {
    setPageOrder(order);
    setPageCount(count);
  }, []);

  const handleFileSelect = (f: File | null) => {
    setFile(f);
    setError(null);
    if (!f) {
      setPageOrder("");
      setPageCount(0);
    }
  };

  const handleReorder = async () => {
    if (!file || !pageOrder.trim()) {
      setError("Upload a PDF and arrange the pages.");
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("page_order", pageOrder.trim());
    try {
      await downloadBlobFromApi("/api/pdfs/reorder", formData, "reordered.pdf");
    } catch (err) {
      setError(await parseApiBlobError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.pdf.label, CATEGORY_META.pdf.href, "Reorder PDF")}
      title="Reorder PDF Pages"
      description="Drag and drop page thumbnails to rearrange your PDF, then download."
      icon={<ArrowUpDown className="h-10 w-10 text-rose-500" />}
      colorTheme="rose"
      privacyMode="server"
      fileLimit="50 MB"
      maxWidth="6xl"
      toolHref="/tools/pdf/reorder"
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
        <PdfUploadZone file={file} onFileSelect={handleFileSelect} />

        <PdfPageReorderGrid file={file} onOrderChange={handleOrderChange} />

        {error && <p className="text-sm text-destructive text-center">{error}</p>}

        <Button
          onClick={handleReorder}
          disabled={!file || !pageCount || loading}
          className="w-full h-12 rounded-xl gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Download Reordered PDF
        </Button>
      </div>
    </ToolLayout>
  );
}
