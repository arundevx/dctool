"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Layers, UploadCloud, FileText, Download, Loader2, X } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { CATEGORY_META } from "@/lib/tools";
import { downloadBlobFromApi, parseApiBlobError } from "@/lib/api";

export default function PdfMergeClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        (f) => f.type === "application/pdf"
      );
      if (droppedFiles.length > 0) {
        setFiles((prev) => [...prev, ...droppedFiles]);
        setError(null);
      } else {
        setError("Please drop valid PDF files only.");
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please select at least 2 PDF files to merge.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      await downloadBlobFromApi("/api/pdfs/merge", formData, "merged_document.pdf");
    } catch (err) {
      setError(await parseApiBlobError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.pdf.label, CATEGORY_META.pdf.href, "Merge PDF")}
      title="Merge PDF"
      description="Combine multiple PDF files into one single document instantly and securely."
      icon={<Layers className="h-10 w-10 text-rose-500" />}
      colorTheme="rose"
      privacyMode="server"
      fileLimit="50 MB per file"
    >
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div
          className="p-10 md:p-20 border-b border-white/5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors relative group"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
          />
          <div className="bg-white/5 border border-white/10 p-5 rounded-full mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg">
            <UploadCloud className="h-12 w-12 text-rose-400" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Drag & Drop PDFs here</h3>
          <p className="text-muted-foreground/80 mb-6 text-lg">
            or click to browse from your computer
          </p>
          <Button className="glass-button rounded-full px-8 h-12 text-base border-rose-500/30 hover:border-rose-500/50">
            Add Files
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive text-center font-medium border-b border-destructive/20">
            {error}
          </div>
        )}

        {files.length > 0 && (
          <div className="p-8 bg-white/5">
            <h3 className="font-semibold mb-6 text-sm uppercase tracking-wider text-foreground/80">
              Selected Files ({files.length})
            </h3>
            <div className="space-y-3 mb-10 max-h-[300px] overflow-y-auto pr-2">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between glass-panel p-4 rounded-xl"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <FileText className="h-6 w-6 text-rose-400 shrink-0" />
                    <span className="font-medium truncate text-base">{file.name}</span>
                    <span className="text-sm text-muted-foreground shrink-0">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    className="h-10 w-10 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                size="lg"
                className="h-14 px-10 text-lg rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-500 hover:via-rose-500 hover:to-orange-500 text-white shadow-[0_0_40px_-10px_rgba(244,63,94,0.6)] transition-all hover:scale-105 border-0 gap-3"
                onClick={handleMerge}
                disabled={loading || files.length < 2}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Merging...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" /> Merge & Download
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
