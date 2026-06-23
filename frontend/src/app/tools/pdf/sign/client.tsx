"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PenLine, Download, Loader2, UploadCloud } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { PdfUploadZone } from "@/components/tools/pdf-upload-zone";
import { PdfSignaturePlacer, type SignaturePlacement } from "@/components/tools/pdf-signature-placer";
import { CATEGORY_META } from "@/lib/tools";
import { downloadBlobFromApi, parseApiBlobError } from "@/lib/api";

export default function SignPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [signature, setSignature] = useState<File | null>(null);
  const [placement, setPlacement] = useState<SignaturePlacement | null>(null);
  const [width, setWidth] = useState(150);
  const [height, setHeight] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sigRef = useRef<HTMLInputElement>(null);

  const handleSignatureSelect = (file: File | null) => {
    setSignature(file);
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const aspect = img.height / img.width || 1;
      setHeight(Math.round(Math.min(400, Math.max(30, width * aspect))));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handlePlacementChange = useCallback((p: SignaturePlacement | null) => {
    setPlacement(p);
  }, []);

  const handleSign = async () => {
    if (!file || !signature || !placement) {
      setError("Upload a PDF, signature image, and position the signature on the preview.");
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("signature", signature);
    formData.append("position", "custom");
    formData.append("page_number", String(placement.pageNumber));
    formData.append("width", String(width));
    formData.append("height", String(height));
    formData.append("x", String(placement.x));
    formData.append("y", String(placement.y));
    try {
      await downloadBlobFromApi("/api/pdfs/sign", formData, "signed.pdf");
    } catch (err) {
      setError(await parseApiBlobError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.pdf.label, CATEGORY_META.pdf.href, "Sign PDF")}
      title="Sign PDF"
      description="Preview your PDF and drag your signature to exactly where you need it."
      icon={<PenLine className="h-10 w-10 text-rose-500" />}
      colorTheme="rose"
      privacyMode="server"
      fileLimit="50 MB"
      maxWidth="6xl"
      toolHref="/tools/pdf/sign"
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <PdfUploadZone file={file} onFileSelect={(f) => { setFile(f); setError(null); }} />
            <div
              className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-rose-400/50 transition-colors"
              onClick={() => sigRef.current?.click()}
            >
              <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">{signature ? signature.name : "Upload signature image (PNG with transparency works best)"}</p>
              <input
                ref={sigRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleSignatureSelect(e.target.files?.[0] || null)}
              />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Signature width ({width} pt)</label>
                <input
                  type="range"
                  min={40}
                  max={400}
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Signature height ({height} pt)</label>
                <input
                  type="range"
                  min={20}
                  max={400}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>
            </div>
          </div>

          <PdfSignaturePlacer
            pdfFile={file}
            signatureFile={signature}
            signatureWidth={width}
            signatureHeight={height}
            onPlacementChange={handlePlacementChange}
          />
        </div>

        {error && <p className="text-sm text-destructive text-center">{error}</p>}
        <Button onClick={handleSign} disabled={loading || !file || !signature || !placement} className="w-full h-12 rounded-xl gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Download Signed PDF
        </Button>
      </div>
    </ToolLayout>
  );
}
