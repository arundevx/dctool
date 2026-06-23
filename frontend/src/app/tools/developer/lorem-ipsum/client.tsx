"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Type } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { CATEGORY_META } from "@/lib/tools";
import { generateLorem } from "@/lib/text-utils";
import { Copy, Check } from "lucide-react";

export default function LoremIpsumClient() {
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setOutput(generateLorem(paragraphs, wordsPerParagraph));
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.developer.label, CATEGORY_META.developer.href, "Lorem Ipsum")}
      title="Lorem Ipsum Generator"
      description="Generate placeholder text for designs, mockups, and prototypes."
      icon={<Type className="h-10 w-10 text-violet-500" />}
      colorTheme="violet"
      privacyMode="browser"
      maxWidth="4xl"
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Paragraphs</label>
            <input
              type="number"
              min={1}
              max={20}
              value={paragraphs}
              onChange={(e) => setParagraphs(Number(e.target.value) || 1)}
              className="w-full h-11 px-3 rounded-xl border border-black/10 dark:border-white/15 bg-transparent text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Words per paragraph</label>
            <input
              type="number"
              min={10}
              max={200}
              value={wordsPerParagraph}
              onChange={(e) => setWordsPerParagraph(Number(e.target.value) || 50)}
              className="w-full h-11 px-3 rounded-xl border border-black/10 dark:border-white/15 bg-transparent text-sm"
            />
          </div>
        </div>

        <Button onClick={handleGenerate} className="w-full h-11 rounded-xl">Generate</Button>

        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Output</label>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 mr-1 text-green-500" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <textarea
              className="w-full min-h-[280px] p-4 font-mono text-sm border border-black/10 dark:border-white/15 rounded-xl bg-muted/30 resize-y"
              readOnly
              value={output}
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
