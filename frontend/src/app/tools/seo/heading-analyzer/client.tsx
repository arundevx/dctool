"use client";

import React, { useState, useMemo } from "react";
import { Heading } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { CATEGORY_META } from "@/lib/tools";
import { analyzeHeadings } from "@/lib/dev-utils";

export default function HeadingAnalyzerClient() {
  const [html, setHtml] = useState("");
  const headings = useMemo(() => (html.trim() ? analyzeHeadings(html) : []), [html]);
  const h1Count = headings.filter((h) => h.level === 1).length;

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.seo.label, CATEGORY_META.seo.href, "Heading Analyzer")}
      title="Heading Structure Analyzer"
      description="Paste HTML to inspect your H1–H6 heading hierarchy for SEO issues."
      icon={<Heading className="h-10 w-10 text-amber-500" />}
      colorTheme="amber"
      privacyMode="browser"
      maxWidth="5xl"
      toolHref="/tools/seo/heading-analyzer"
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
        <textarea
          className="w-full min-h-[200px] p-4 font-mono text-sm border border-black/10 dark:border-white/15 rounded-xl bg-background resize-y"
          placeholder="Paste HTML source..."
          value={html}
          onChange={(e) => setHtml(e.target.value)}
        />

        {html.trim() && (
          <>
            {h1Count !== 1 && (
              <p className={`text-sm p-3 rounded-xl ${h1Count === 0 ? "bg-amber-500/10 text-amber-700" : "bg-red-500/10 text-red-700"}`}>
                {h1Count === 0 ? "Warning: No H1 found." : `Warning: ${h1Count} H1 tags found (recommended: 1).`}
              </p>
            )}
            <div className="rounded-xl border border-black/10 dark:border-white/15 divide-y divide-black/5 max-h-[400px] overflow-y-auto">
              {headings.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No headings found.</p>
              ) : (
                headings.map((h, i) => (
                  <div key={i} className="flex gap-3 p-3 text-sm" style={{ paddingLeft: `${12 + (h.level - 1) * 16}px` }}>
                    <span className="font-mono font-bold text-amber-500 shrink-0">{h.tag}</span>
                    <span>{h.text || "(empty)"}</span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
