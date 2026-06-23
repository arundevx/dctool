"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileImage, X } from "lucide-react";

interface ImageUploadZoneProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  accent?: "blue" | "fuchsia";
}

export function ImageUploadZone({
  file,
  onFileSelect,
  accent = "blue",
}: ImageUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const accentText = accent === "fuchsia" ? "text-fuchsia-600 dark:text-fuchsia-400" : "text-blue-600 dark:text-blue-400";
  const accentBorder = accent === "fuchsia" ? "border-fuchsia-500/30 hover:border-fuchsia-500/50" : "border-blue-500/30 hover:border-blue-500/50";
  const clearBorder = accent === "fuchsia" ? "border-fuchsia-500/30 hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10" : "border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/10";

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) fileInputRef.current.value = "";
    onFileSelect(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped?.type.startsWith("image/")) {
      onFileSelect(dropped);
    }
  };

  return (
    <div
      className="p-8 md:p-12 border-b dark:border-white/5 border-black/5 flex flex-col items-center justify-center text-center cursor-pointer dark:hover:bg-white/5 hover:bg-black/5 transition-colors"
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 p-5 rounded-full mb-6 shadow-lg">
        <UploadCloud className={`h-12 w-12 ${accentText}`} />
      </div>
      {file ? (
        <div className="flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <div className={`flex items-center gap-2 text-lg font-medium ${accentText}`}>
            <FileImage className="h-6 w-6" />
            <span>{file.name}</span>
          </div>
          <span className="text-muted-foreground dark:bg-white/5 bg-black/5 px-3 py-1 rounded-full text-sm">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={`rounded-full ${clearBorder}`}
            onClick={handleClear}
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-bold mb-2">Drag & Drop your image here</h3>
          <p className="text-muted-foreground/80 mb-6">or click to browse</p>
          <Button type="button" className={`glass-button rounded-full px-8 h-12 ${accentBorder}`}>
            Browse Files
          </Button>
        </div>
      )}
    </div>
  );
}

export function useImageDimensions(file: File | null) {
  const [dimensions, setDimensions] = React.useState<{ width: number; height: number } | null>(null);

  React.useEffect(() => {
    if (!file) {
      setDimensions(null);
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setDimensions(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [file]);

  return dimensions;
}
