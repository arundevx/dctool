"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { AlignLeft } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { CATEGORY_META } from "@/lib/tools";
import { countWordsAndChars, getKeywordDensity } from "@/lib/text-utils";

export default function WordCounterClient() {
  const [text, setText] = useState("");
  const [keyword, setKeyword] = useState("");
  const stats = useMemo(() => countWordsAndChars(text), [text]);
  const keywordStats = useMemo(() => getKeywordDensity(text, keyword), [text, keyword]);

  const cards = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.chars },
    { label: "Characters (no spaces)", value: stats.charsNoSpaces },
    { label: "Lines", value: stats.lines },
    { label: "Sentences", value: stats.sentences },
    { label: "Reading time", value: stats.words > 0 ? `${stats.readingTimeMinutes} min` : "—" },
  ];

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.seo.label, CATEGORY_META.seo.href, "Word Counter")}
      title="Word & Character Counter"
      description="Count words, characters, reading time, and keyword density for SEO."
      icon={<AlignLeft className="h-10 w-10 text-amber-500" />}
      colorTheme="amber"
      privacyMode="browser"
      maxWidth="4xl"
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {cards.map((c) => (
            <div key={c.label} className="p-4 rounded-xl bg-muted/30 text-center">
              <p className="text-2xl font-bold text-amber-500">{c.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Keyword density check</label>
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter a keyword to analyze..."
            className="h-11 rounded-xl"
          />
          {keyword.trim() && text.trim() && (
            <p className="text-sm text-muted-foreground">
              &ldquo;{keyword.trim()}&rdquo; appears <strong>{keywordStats.count}</strong> time
              {keywordStats.count !== 1 ? "s" : ""} — density{" "}
              <strong>{keywordStats.density}%</strong>
            </p>
          )}
        </div>

        <textarea
          className="w-full min-h-[360px] p-4 text-sm border border-black/10 dark:border-white/15 rounded-xl bg-background focus:ring-2 focus:ring-amber-500 outline-none resize-y"
          placeholder="Start typing or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </ToolLayout>
  );
}
