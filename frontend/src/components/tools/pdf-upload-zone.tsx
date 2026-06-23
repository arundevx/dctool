"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, X } from "lucide-react";

interface PdfUploadZoneProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  accept?: string;
  label?: string;
}

export function PdfUploadZone({
  file,
  onFileSelect,
  accept = "application/pdf",
  label = "PDF",
}: PdfUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) fileInputRef.current.value = "";
    onFileSelect(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) onFileSelect(e.target.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    if (accept === "application/pdf" && dropped.type !== "application/pdf") return;
    if (accept.includes("docx") && !dropped.name.toLowerCase().endsWith(".docx")) return;
    onFileSelect(dropped);
  };

  return (
    <div
      className="p-8 md:p-12 border-b dark:border-white/5 border-black/5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
      />
      <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-full mb-6 shadow-lg">
        <UploadCloud className="h-12 w-12 text-rose-500" />
      </div>
      {file ? (
        <div className="flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2 text-lg font-medium text-rose-500">
            <FileText className="h-6 w-6" />
            <span>{file.name}</span>
          </div>
          <span className="text-muted-foreground bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full text-sm">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full border-rose-500/30 hover:border-rose-500/50 hover:bg-rose-500/10"
            onClick={handleClear}
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-bold mb-2">Drag & Drop your {label} here</h3>
          <p className="text-muted-foreground/80 mb-6">or click to browse</p>
          <Button type="button" className="glass-button rounded-full px-8 h-12 border-rose-500/30 hover:border-rose-500/50">
            Browse Files
          </Button>
        </div>
      )}
    </div>
  );
}
