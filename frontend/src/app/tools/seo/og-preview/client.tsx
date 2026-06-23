"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Loader2 } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { CATEGORY_META } from "@/lib/tools";
import { postUrlEncodedFromApi, parseApiBlobError } from "@/lib/api";
import axios from "axios";

type OgData = {
  title: string;
  description: string;
  image: string;
  site_name: string;
  og_title: string;
  url: string;
};

export default function OgPreviewClient() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [siteName, setSiteName] = useState("DreamConsole");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFromUrl = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await postUrlEncodedFromApi<OgData>("/api/seo/fetch-page", { url: url.trim() });
      setTitle(data.og_title || data.title);
      setDescription(data.description);
      setImage(data.image);
      setSiteName(data.site_name || new URL(data.url).hostname);
    } catch (err) {
      setError(axios.isAxiosError(err) && err.response?.data?.detail ? String(err.response.data.detail) : await parseApiBlobError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.seo.label, CATEGORY_META.seo.href, "OG Preview")}
      title="Open Graph Preview"
      description="Preview your social sharing card or fetch OG tags from a URL."
      icon={<Share2 className="h-10 w-10 text-amber-500" />}
      colorTheme="amber"
      privacyMode="browser"
      maxWidth="5xl"
      toolHref="/tools/seo/og-preview"
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
        <div className="flex gap-2">
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="h-11 rounded-xl" />
          <Button onClick={fetchFromUrl} disabled={loading} className="shrink-0 rounded-xl gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Fetch
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="h-11 rounded-xl" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full min-h-[100px] p-3 rounded-xl border border-black/10 dark:border-white/15 text-sm resize-y" />
            <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" className="h-11 rounded-xl" />
            <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Site name" className="h-11 rounded-xl" />
          </div>

          <div className="rounded-xl border border-black/10 dark:border-white/15 overflow-hidden bg-white dark:bg-zinc-900 max-w-md">
            {image ? (
              <div className="aspect-[1.91/1] bg-muted relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            ) : (
              <div className="aspect-[1.91/1] bg-muted flex items-center justify-center text-sm text-muted-foreground">No image</div>
            )}
            <div className="p-3 border-t border-black/5">
              <p className="text-[10px] uppercase text-muted-foreground tracking-wide">{siteName || "website.com"}</p>
              <p className="font-semibold text-sm line-clamp-2 mt-0.5">{title || "Page title"}</p>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{description || "Description preview"}</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
