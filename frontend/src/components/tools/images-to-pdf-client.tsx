"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2, UploadCloud, X } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { CATEGORY_META, type ToolCategory } from "@/lib/tools";
import { downloadBlobFromApi, parseApiBlobError } from "@/lib/api";

interface ImagesToPdfClientProps {
  category: ToolCategory;
  toolTitle: string;
  pageTitle: string;
  description: string;
  toolHref: string;
  singleImage?: boolean;
}

export function ImagesToPdfClient({
  category,
  toolTitle,
  pageTitle,
  description,
  toolHref,
  singleImage = false,
}: ImagesToPdfClientProps) {
  const meta = CATEGORY_META[category];
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    const imgs = Array.from(list).filter((f) => f.type.startsWith("image/"));
    setFiles(singleImage ? imgs.slice(0, 1) : imgs);
    setError(null);
  };

  const handleConvert = async () => {
    if (!files.length) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    try {
      await downloadBlobFromApi("/api/pdfs/images-to-pdf", formData, "images.pdf");
    } catch (err) {
      setError(await parseApiBlobError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(meta.label, meta.href, toolTitle)}
      title={pageTitle}
      description={description}
      icon={<FileText className={`h-10 w-10 ${category === "pdf" ? "text-rose-500" : "text-blue-500"}`} />}
      colorTheme={meta.colorTheme}
      privacyMode="server"
      fileLimit="50 MB"
      toolHref={toolHref}
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
        <div
          className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        >
          <UploadCloud className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">{singleImage ? "Drop an image or click to upload" : "Drop images or click to upload"}</p>
          <p className="text-sm text-muted-foreground mt-1">PNG, JPG, WEBP, HEIC supported</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={!singleImage}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={`${f.name}-${i}`} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 text-sm">
                <span className="truncate">{f.name}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-sm text-destructive text-center">{error}</p>}

        <Button onClick={handleConvert} disabled={!files.length || loading} className="w-full h-12 rounded-xl gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {loading ? "Creating PDF..." : "Download PDF"}
        </Button>
      </div>
    </ToolLayout>
  );
}
