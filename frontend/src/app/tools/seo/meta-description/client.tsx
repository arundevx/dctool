"use client";

import React, { useState, useMemo } from "react";
import { Ruler } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { CATEGORY_META } from "@/lib/tools";
import { metaDescriptionStats } from "@/lib/dev-utils";

export default function MetaDescriptionClient() {
  const [text, setText] = useState("");
  const stats = useMemo(() => metaDescriptionStats(text), [text]);

  const barColor =
    stats.status === "good" ? "bg-green-500" : stats.status === "short" ? "bg-amber-500" : "bg-red-500";

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.seo.label, CATEGORY_META.seo.href, "Meta Description")}
      title="Meta Description Checker"
      description="Optimize your meta description length for search results (120–160 characters)."
      icon={<Ruler className="h-10 w-10 text-amber-500" />}
      colorTheme="amber"
      privacyMode="browser"
      maxWidth="4xl"
      toolHref="/tools/seo/meta-description"
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-4 rounded-xl bg-muted/30">
            <p className="text-2xl font-bold text-amber-500">{stats.length}</p>
            <p className="text-xs text-muted-foreground">Characters</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30">
            <p className="text-2xl font-bold text-amber-500">~{stats.pixels}px</p>
            <p className="text-xs text-muted-foreground">Est. width</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30">
            <p className={`text-2xl font-bold capitalize ${stats.status === "good" ? "text-green-500" : stats.status === "short" ? "text-amber-500" : "text-red-500"}`}>
              {stats.status}
            </p>
            <p className="text-xs text-muted-foreground">Status</p>
          </div>
        </div>

        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div className={`h-full transition-all ${barColor}`} style={{ width: `${Math.min(100, (stats.length / 160) * 100)}%` }} />
        </div>
        <p className="text-xs text-muted-foreground text-center">Recommended: 120–160 characters</p>

        <textarea
          className="w-full min-h-[160px] p-4 text-sm border border-black/10 dark:border-white/15 rounded-xl bg-background resize-y"
          placeholder="Paste your meta description..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={320}
        />

        <div className="p-4 rounded-xl border border-black/10 dark:border-white/15">
          <p className="text-xs text-green-600 mb-1">Google preview</p>
          <p className="text-blue-600 text-lg font-medium truncate">Your Page Title — Site Name</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{text || "Your meta description will appear here..."}</p>
        </div>
      </div>
    </ToolLayout>
  );
}
