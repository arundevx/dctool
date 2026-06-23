"use client";

import React, { useState, useMemo } from "react";
import { GitCompareArrows } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { CATEGORY_META } from "@/lib/tools";
import { diffLines } from "@/lib/text-utils";

export default function TextDiffClient() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");

  const diff = useMemo(() => diffLines(textA, textB), [textA, textB]);

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.seo.label, CATEGORY_META.seo.href, "Text Diff")}
      title="Diff Checker"
      description="Compare two texts line by line and see what changed."
      icon={<GitCompareArrows className="h-10 w-10 text-amber-500" />}
      colorTheme="amber"
      privacyMode="browser"
      maxWidth="6xl"
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Original text</label>
            <textarea
              className="w-full min-h-[240px] p-4 font-mono text-sm border border-black/10 dark:border-white/15 rounded-xl bg-background resize-y"
              placeholder="Paste original text..."
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Modified text</label>
            <textarea
              className="w-full min-h-[240px] p-4 font-mono text-sm border border-black/10 dark:border-white/15 rounded-xl bg-background resize-y"
              placeholder="Paste modified text..."
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
            />
          </div>
        </div>

        {(textA || textB) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Diff result</label>
            <div className="rounded-xl border border-black/10 dark:border-white/15 overflow-hidden font-mono text-sm max-h-[400px] overflow-y-auto">
              {diff.map((line, i) => (
                <div
                  key={i}
                  className={`px-4 py-1 ${
                    line.type === "added"
                      ? "bg-green-500/10 text-green-700 dark:text-green-400"
                      : line.type === "removed"
                        ? "bg-red-500/10 text-red-700 dark:text-red-400"
                        : "bg-muted/20"
                  }`}
                >
                  <span className="select-none mr-2 opacity-50">
                    {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                  </span>
                  {line.text || "\u00a0"}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
