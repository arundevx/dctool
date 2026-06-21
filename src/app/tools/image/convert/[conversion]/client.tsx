"use client"

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, UploadCloud, FileImage, Download, Loader2 } from "lucide-react";
import axios from "axios";

interface ImageConvertClientProps {
  fromFormat: string;
  toFormat: string;
}

export default function ImageConvertClient({ fromFormat, toFormat }: ImageConvertClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fallback to "JPEG" if the URL param says "JPG" since backend expects "JPEG"
  const backendTargetFormat = toFormat === "JPG" ? "JPEG" : toFormat;

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

  const handleConvert = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_format", backendTargetFormat);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/images/convert`, formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers['content-disposition'];
      let filename = `converted_${file.name.split('.')[0]}.${toFormat.toLowerCase()}`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      if (err.response && err.response.data instanceof Blob) {
        const errorText = await err.response.data.text();
        try {
          const errorJson = JSON.parse(errorText);
          setError(errorJson.detail || "Conversion failed");
        } catch {
          setError("Conversion failed");
        }
      } else {
        setError(err.message || "An error occurred during conversion.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen grid-pattern relative">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-background to-transparent pointer-events-none -z-10"></div>
      
      <div className="container mx-auto py-16 px-4 md:px-8 max-w-4xl relative z-10">
        <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-3xl mb-6 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]">
            <ArrowRightLeft className="h-10 w-10 text-blue-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-glow bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
            Convert {fromFormat} to {toFormat}
          </h1>
          <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto">Upload your {fromFormat} image and instantly download it as a {toFormat}. Free and secure.</p>
        </div>

        <div className="glass-panel rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <div 
            className="p-10 md:p-20 border-b dark:border-white/5 border-black/5 flex flex-col items-center justify-center text-center cursor-pointer dark:hover:bg-white/5 hover:bg-black/5 transition-colors relative group"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept={`image/${fromFormat.toLowerCase() === 'jpg' ? 'jpeg' : fromFormat.toLowerCase()},image/*`}
              onChange={handleFileChange}
            />
            <div className="dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 p-5 rounded-full mb-6 group-hover:scale-110 dark:group-hover:bg-blue-500/20 group-hover:bg-blue-500/10 dark:group-hover:border-blue-500/30 group-hover:border-blue-500/20 transition-all duration-500 shadow-lg">
              <UploadCloud className="h-12 w-12 text-blue-500 dark:text-blue-400" />
            </div>
            {file ? (
              <div className="flex flex-col items-center gap-3 relative z-10">
                <div className="flex items-center gap-2 text-lg font-medium text-blue-600 dark:text-blue-400">
                  <FileImage className="h-6 w-6" />
                  <span>{file.name}</span>
                </div>
                <span className="text-muted-foreground dark:bg-white/5 bg-black/5 px-3 py-1 rounded-full text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            ) : (
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Drag & Drop your {fromFormat} here</h3>
                <p className="text-muted-foreground/80 mb-6 text-lg">or click to browse from your computer</p>
                <Button className="glass-button rounded-full px-8 h-12 text-base border-blue-500/30 hover:border-blue-500/50">Browse Files</Button>
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
              className="h-16 px-12 text-xl rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.6)] transition-all hover:scale-105 border-0 gap-3" 
              onClick={handleConvert} 
              disabled={loading || !file}
            >
              {loading ? (
                <><Loader2 className="h-6 w-6 animate-spin" /> Processing...</>
              ) : (
                <><Download className="h-6 w-6" /> Convert to {toFormat}</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
