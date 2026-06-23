"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileImage, Download, Loader2, Wand2 } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { CATEGORY_META } from "@/lib/tools";
import { downloadBlobFromApi, parseApiBlobError } from "@/lib/api";

export default function RemoveBgClient() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("image/")) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError("Please drop a valid image file.");
      }
    }
  };

  const handleRemoveBg = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await downloadBlobFromApi(
        "/api/images/remove-bg",
        formData,
        `nobg_${file.name.split(".")[0]}.png`
      );
    } catch (err) {
      setError(await parseApiBlobError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(
        CATEGORY_META.image.label,
        CATEGORY_META.image.href,
        "Background Remover"
      )}
      title="AI Background Remover"
      description="Upload any image and let our AI erase the background. Perfect for products, portraits, and more."
      icon={<Wand2 className="h-10 w-10 text-fuchsia-500" />}
      colorTheme="fuchsia"
      privacyMode="server"
      fileLimit="10 MB"
    >
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div
          className="p-10 md:p-20 border-b dark:border-white/5 border-black/5 flex flex-col items-center justify-center text-center cursor-pointer dark:hover:bg-white/5 hover:bg-black/5 transition-colors relative group"
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
          <div className="dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 p-5 rounded-full mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg">
            <UploadCloud className="h-12 w-12 text-fuchsia-500 dark:text-fuchsia-400" />
          </div>
          {file ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-lg font-medium text-fuchsia-600 dark:text-fuchsia-400">
                <FileImage className="h-6 w-6" />
                <span>{file.name}</span>
              </div>
              <span className="text-muted-foreground dark:bg-white/5 bg-black/5 px-3 py-1 rounded-full text-sm">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-bold mb-2">Drag & Drop your image here</h3>
              <p className="text-muted-foreground/80 mb-6 text-lg">
                or click to browse from your computer
              </p>
              <Button className="glass-button rounded-full px-8 h-12 text-base border-fuchsia-500/30 hover:border-fuchsia-500/50">
                Browse Files
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive text-center font-medium border-b border-destructive/20">
            {error}
          </div>
        )}

        <div className="p-8 dark:bg-white/5 bg-black/5 flex justify-center">
          <Button
            size="lg"
            className="h-14 px-10 text-lg rounded-full bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 hover:from-fuchsia-500 hover:via-pink-500 hover:to-rose-500 text-white shadow-[0_0_40px_-10px_rgba(217,70,239,0.6)] transition-all hover:scale-105 border-0 gap-3"
            onClick={handleRemoveBg}
            disabled={loading || !file}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Removing Background...
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5" /> Remove Background
              </>
            )}
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
