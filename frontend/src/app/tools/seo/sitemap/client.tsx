"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Map, Copy, Download, Check } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { CATEGORY_META } from "@/lib/tools";

export default function SitemapClient() {
  const [urls, setUrls] = useState("");
  const [changefreq, setChangefreq] = useState("weekly");
  const [priority, setPriority] = useState("0.8");
  const [copied, setCopied] = useState(false);

  const generateSitemap = () => {
    const lines = urls
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const urlEntries = lines
      .map(
        (loc) => `  <url>
    <loc>${escapeXml(loc)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
      )
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
  };

  const output = generateSitemap();

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "application/xml" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sitemap.xml";
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(
        CATEGORY_META.seo.label,
        CATEGORY_META.seo.href,
        "Sitemap Generator"
      )}
      title="XML Sitemap Generator"
      description="Paste your page URLs and generate a ready-to-use sitemap.xml file."
      icon={<Map className="h-10 w-10 text-amber-500" />}
      colorTheme="amber"
      privacyMode="browser"
      maxWidth="6xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 glass-panel p-6 md:p-8 rounded-3xl">
          <div className="space-y-3">
            <label className="text-sm font-medium text-amber-500">
              Page URLs (one per line)
            </label>
            <textarea
              className="w-full min-h-[280px] p-4 font-mono text-sm border border-white/10 rounded-2xl bg-black/20 focus:ring-2 focus:ring-amber-500 outline-none resize-y"
              placeholder={"https://dreamconsole.org/\nhttps://dreamconsole.org/tools/image\nhttps://dreamconsole.org/blog"}
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-amber-500">Change frequency</label>
              <select
                value={changefreq}
                onChange={(e) => setChangefreq(e.target.value)}
                className="w-full h-11 px-3 rounded-xl glass-panel border border-white/10 bg-transparent text-sm"
              >
                <option value="always">always</option>
                <option value="hourly">hourly</option>
                <option value="daily">daily</option>
                <option value="weekly">weekly</option>
                <option value="monthly">monthly</option>
                <option value="yearly">yearly</option>
                <option value="never">never</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-amber-500">Priority</label>
              <Input
                className="h-11 glass-panel border-white/10 rounded-xl"
                type="number"
                min={0}
                max={1}
                step={0.1}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 glass-panel p-6 md:p-8 rounded-3xl flex flex-col">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-amber-500">Generated sitemap.xml</h2>
            <div className="flex gap-2">
              <Button className="glass-button rounded-full px-4" size="sm" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4 mr-1 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button className="glass-button rounded-full px-4" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
            </div>
          </div>
          <textarea
            className="w-full flex-1 min-h-[360px] p-4 font-mono text-sm border border-white/10 rounded-2xl bg-black/40 focus:ring-2 focus:ring-amber-500 outline-none resize-none text-amber-100"
            readOnly
            value={output}
          />
        </div>
      </div>
    </ToolLayout>
  );
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
