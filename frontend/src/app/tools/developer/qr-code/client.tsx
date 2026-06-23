"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QrCode, Download } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { CATEGORY_META } from "@/lib/tools";
import QRCodeLib from "qrcode";

export default function QrCodeClient() {
  const [text, setText] = useState("https://dreamconsole.org");
  const [dataUrl, setDataUrl] = useState("");
  const [size, setSize] = useState(256);

  useEffect(() => {
    if (!text.trim()) {
      setDataUrl("");
      return;
    }
    QRCodeLib.toDataURL(text, { width: size, margin: 2 })
      .then(setDataUrl)
      .catch(() => setDataUrl(""));
  }, [text, size]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "qrcode.png";
    link.click();
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.developer.label, CATEGORY_META.developer.href, "QR Code")}
      title="QR Code Generator"
      description="Create QR codes from any text or URL and download as PNG."
      icon={<QrCode className="h-10 w-10 text-violet-500" />}
      colorTheme="violet"
      privacyMode="browser"
      maxWidth="4xl"
      toolHref="/tools/developer/qr-code"
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or URL..."
          className="w-full min-h-[100px] p-4 text-sm rounded-xl border border-black/10 dark:border-white/15 bg-background resize-y"
        />
        <div className="space-y-2">
          <label className="text-sm font-medium">Size: {size}px</label>
          <input type="range" min={128} max={512} step={32} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-violet-500" />
        </div>
        <div className="flex flex-col items-center gap-4">
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUrl} alt="QR Code" className="rounded-xl border border-black/10" width={size} height={size} />
          ) : (
            <div className="w-64 h-64 rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-sm">Enter text above</div>
          )}
          <Button onClick={handleDownload} disabled={!dataUrl} className="gap-2 rounded-xl">
            <Download className="h-4 w-4" /> Download PNG
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
