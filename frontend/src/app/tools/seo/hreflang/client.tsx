"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Copy, Check, Plus, Trash2 } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { CATEGORY_META } from "@/lib/tools";

type Entry = { lang: string; url: string };

export default function HreflangClient() {
  const [entries, setEntries] = useState<Entry[]>([
    { lang: "en", url: "https://example.com/" },
    { lang: "es", url: "https://example.com/es/" },
  ]);
  const [xDefault, setXDefault] = useState("https://example.com/");
  const [copied, setCopied] = useState(false);

  const output = [
    ...entries
      .filter((e) => e.lang && e.url)
      .map((e) => `<link rel="alternate" hreflang="${e.lang}" href="${e.url}" />`),
    xDefault ? `<link rel="alternate" hreflang="x-default" href="${xDefault}" />` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.seo.label, CATEGORY_META.seo.href, "hreflang Generator")}
      title="hreflang Tag Generator"
      description="Build hreflang alternate link tags for multilingual and regional pages."
      icon={<Globe className="h-10 w-10 text-amber-500" />}
      colorTheme="amber"
      privacyMode="browser"
      maxWidth="5xl"
      toolHref="/tools/seo/hreflang"
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
        <div className="space-y-3">
          {entries.map((entry, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input value={entry.lang} onChange={(e) => { const n = [...entries]; n[i].lang = e.target.value; setEntries(n); }} placeholder="en" className="w-24 h-10 rounded-xl font-mono" />
              <Input value={entry.url} onChange={(e) => { const n = [...entries]; n[i].url = e.target.value; setEntries(n); }} placeholder="https://..." className="flex-1 h-10 rounded-xl font-mono text-sm" />
              <Button variant="ghost" size="icon" onClick={() => setEntries(entries.filter((_, j) => j !== i))} disabled={entries.length <= 1}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setEntries([...entries, { lang: "", url: "" }])} className="gap-1">
            <Plus className="h-4 w-4" /> Add language
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">x-default URL</label>
          <Input value={xDefault} onChange={(e) => setXDefault(e.target.value)} className="h-11 rounded-xl font-mono text-sm" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Generated tags</label>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <textarea readOnly value={output} className="w-full min-h-[160px] p-4 font-mono text-sm rounded-xl bg-muted/30 border border-black/10 dark:border-white/15" />
        </div>
      </div>
    </ToolLayout>
  );
}
