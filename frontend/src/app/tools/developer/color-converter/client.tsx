"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Palette, Loader2, UploadCloud } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { ColorEyedropperCanvas } from "@/components/tools/color-eyedropper-canvas";
import { CATEGORY_META } from "@/lib/tools";
import { hexToRgb, rgbToHex } from "@/lib/text-utils";
import { postJsonFromApi, postUrlEncodedFromApi, API_URL } from "@/lib/api";
import axios from "axios";

type Tab = "picker" | "image" | "website";
type ColorEntry = { hex: string; rgb?: number[] };

export default function ColorConverterClient() {
  const [tab, setTab] = useState<Tab>("picker");
  const [hex, setHex] = useState("#8b5cf6");
  const [r, setR] = useState(139);
  const [g, setG] = useState(92);
  const [b, setB] = useState(246);
  const [extracted, setExtracted] = useState<ColorEntry[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [websitePreview, setWebsitePreview] = useState<string | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const rgb = hexToRgb(hex);
    if (rgb) {
      setR(rgb.r);
      setG(rgb.g);
      setB(rgb.b);
    }
  }, [hex]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
      if (websitePreview?.startsWith("blob:")) URL.revokeObjectURL(websitePreview);
    };
  }, [imagePreview, websitePreview]);

  const applyColor = (color: string) => {
    setHex(color.startsWith("#") ? color : `#${color}`);
  };

  const updateFromRgb = (nr: number, ng: number, nb: number) => {
    setR(nr);
    setG(ng);
    setB(nb);
    setHex(rgbToHex(nr, ng, nb));
  };

  const handleImageUpload = async (file: File) => {
    setError(null);
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("count", "8");
    try {
      const data = await postJsonFromApi<{ colors: ColorEntry[] }>("/api/images/extract-colors", formData);
      setExtracted(data.colors);
    } catch {
      setExtracted([]);
    } finally {
      setLoading(false);
    }
  };

  const loadWebsitePreview = async () => {
    if (!websiteUrl.trim()) return;
    setLoading(true);
    setError(null);
    if (websitePreview?.startsWith("blob:")) URL.revokeObjectURL(websitePreview);
    setWebsitePreview(null);

    try {
      const data = await postUrlEncodedFromApi<{
        image: string;
        colors: string[];
      }>("/api/seo/fetch-page", { url: websiteUrl.trim() });

      setExtracted(data.colors.map((c) => ({ hex: c })));

      if (data.image) {
        const proxyForm = new URLSearchParams();
        proxyForm.append("image_url", data.image);
        const response = await axios.post(`${API_URL}/api/seo/proxy-image`, proxyForm, {
          responseType: "blob",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        setWebsitePreview(URL.createObjectURL(response.data));
      } else {
        setError("No preview image found for this URL. Try a site with an Open Graph image, or use the Image tab.");
      }
    } catch (err) {
      setError(axios.isAxiosError(err) ? String(err.response?.data?.detail || err.message) : "Failed to fetch URL");
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "picker", label: "Color Picker" },
    { id: "image", label: "From Image" },
    { id: "website", label: "From Website" },
  ];

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.developer.label, CATEGORY_META.developer.href, "Color Tools")}
      title="Color Picker & Extractor"
      description="Pick colors with the mouse from images or website previews, or use the classic picker."
      icon={<Palette className="h-10 w-10 text-violet-500" />}
      colorTheme="violet"
      privacyMode="browser"
      maxWidth="5xl"
      toolHref="/tools/developer/color-converter"
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <Button key={t.id} variant={tab === t.id ? "default" : "outline"} size="sm" onClick={() => setTab(t.id)}>
              {t.label}
            </Button>
          ))}
        </div>

        <div className="w-full h-28 rounded-2xl border border-black/10 dark:border-white/15" style={{ backgroundColor: hex }} />

        {tab === "picker" && (
          <>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium shrink-0">Picker</label>
              <input type="color" value={hex.length === 7 ? hex : "#8b5cf6"} onChange={(e) => setHex(e.target.value)} className="h-12 w-20 rounded-lg cursor-pointer border-0" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">HEX</label>
              <Input value={hex} onChange={(e) => { let v = e.target.value; if (!v.startsWith("#")) v = "#" + v; setHex(v); }} className="h-11 rounded-xl font-mono" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {(["R", "G", "B"] as const).map((label, i) => {
                const val = [r, g, b][i];
                return (
                  <div key={label} className="space-y-2">
                    <label className="text-sm font-medium">{label}</label>
                    <Input type="number" min={0} max={255} value={val} onChange={(e) => {
                      const n = Number(e.target.value) || 0;
                      const vals = [r, g, b];
                      vals[i] = n;
                      updateFromRgb(vals[0], vals[1], vals[2]);
                    }} className="h-11 rounded-xl font-mono" />
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === "image" && (
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-violet-400/50" onClick={() => fileRef.current?.click()}>
              <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Upload an image, then click to pick any color</p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
            </div>
            {loading && <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Processing...</p>}
            <ColorEyedropperCanvas imageSrc={imagePreview} onPick={applyColor} />
          </div>
        )}

        {tab === "website" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://example.com" className="h-11 rounded-xl" />
              <Button onClick={loadWebsitePreview} disabled={loading} className="shrink-0 rounded-xl gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load preview"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Loads the site&apos;s Open Graph image so you can pick colors with your mouse.</p>
            <ColorEyedropperCanvas imageSrc={websitePreview} onPick={applyColor} label="Website preview" />
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        {extracted.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Suggested palette</label>
            <div className="flex flex-wrap gap-2">
              {extracted.map((c, i) => (
                <button
                  key={`${c.hex}-${i}`}
                  type="button"
                  onClick={() => applyColor(c.hex)}
                  className="w-12 h-12 rounded-xl border-2 border-white shadow-sm hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.hex }}
                  title={c.hex}
                />
              ))}
            </div>
          </div>
        )}

        <div className="p-4 rounded-xl bg-muted/30 font-mono text-sm space-y-1">
          <p>HEX: {hex}</p>
          <p>RGB: rgb({r}, {g}, {b})</p>
          <p>CSS: color: {hex};</p>
        </div>
      </div>
    </ToolLayout>
  );
}
