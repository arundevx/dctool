"use client"

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Layers, UploadCloud, FileText, Download, Loader2, X } from "lucide-react";
import axios from "axios";

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
      const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === "application/pdf");
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
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/pdfs/merge`, formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', "merged_document.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      if (err.response && err.response.data instanceof Blob) {
        const errorText = await err.response.data.text();
        try {
          const errorJson = JSON.parse(errorText);
          setError(errorJson.detail || "Merge failed");
        } catch {
          setError("Merge failed");
        }
      } else {
        setError(err.message || "An error occurred during merging.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen grid-pattern relative">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-500/10 via-background to-transparent pointer-events-none -z-10"></div>
      
      <div className="container mx-auto py-16 px-4 md:px-8 max-w-4xl relative z-10">
        <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-4 bg-red-500/10 border border-red-500/20 rounded-3xl mb-6 shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)]">
            <Layers className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-glow bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-rose-600">
            Merge PDF
          </h1>
          <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto">Combine multiple PDF files into one single document instantly and securely.</p>
        </div>

        <div className="glass-panel rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <div 
            className="p-10 md:p-20 border-b border-white/5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors relative group"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="application/pdf"
              multiple
              onChange={handleFileChange}
            />
            <div className="bg-white/5 border border-white/10 p-5 rounded-full mb-6 group-hover:scale-110 group-hover:bg-red-500/20 group-hover:border-red-500/30 transition-all duration-500 shadow-lg">
              <UploadCloud className="h-12 w-12 text-red-400" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Drag & Drop PDFs here</h3>
              <p className="text-muted-foreground/80 mb-6 text-lg">or click to browse from your computer</p>
              <Button className="glass-button rounded-full px-8 h-12 text-base border-red-500/30 hover:border-red-500/50">Add Files</Button>
            </div>
          </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive text-center font-medium border-b border-destructive/20">
            {error}
          </div>
        )}

        {files.length > 0 && (
          <div className="p-8 bg-white/5">
            <h3 className="font-semibold mb-6 text-sm uppercase tracking-wider text-foreground/80">Selected Files ({files.length})</h3>
            <div className="space-y-3 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between glass-panel p-4 rounded-xl">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <FileText className="h-6 w-6 text-red-400 shrink-0" />
                    <span className="font-medium truncate text-base">{file.name}</span>
                    <span className="text-sm text-muted-foreground shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="h-10 w-10 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="h-16 px-12 text-xl rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-500 hover:via-rose-500 hover:to-orange-500 text-white shadow-[0_0_40px_-10px_rgba(244,63,94,0.6)] transition-all hover:scale-105 border-0 gap-3" 
                onClick={handleMerge} 
                disabled={loading || files.length < 2}
              >
                {loading ? (
                  <><Loader2 className="h-6 w-6 animate-spin" /> Merging...</>
                ) : (
                  <><Download className="h-6 w-6" /> Merge & Download</>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
