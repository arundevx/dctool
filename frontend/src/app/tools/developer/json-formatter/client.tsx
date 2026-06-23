"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Minimize, AlignLeft, Check, FileJson } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { CATEGORY_META } from "@/lib/tools";

export default function JsonFormatterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  const handleMinify = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.developer.label, CATEGORY_META.developer.href, "JSON Formatter")}
      title="JSON Formatter & Validator"
      description="Format, validate, and minify your JSON data instantly in the browser."
      icon={<FileJson className="h-10 w-10 text-violet-500" />}
      colorTheme="violet"
      privacyMode="browser"
      maxWidth="6xl"
      toolHref="/tools/developer/json-formatter"
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Input JSON</label>
              <Button variant="ghost" size="sm" onClick={() => { setInput(""); setOutput(""); setError(null); }}>
                <RefreshCw className="h-4 w-4 mr-1" /> Clear
              </Button>
            </div>
            <textarea
              className="w-full min-h-[400px] p-4 font-mono text-sm border border-black/10 dark:border-white/15 rounded-xl bg-background focus:ring-2 focus:ring-violet-500 outline-none resize-y"
              placeholder="Paste your JSON here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Output</label>
              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output}>
                {copied ? <Check className="h-4 w-4 mr-1 text-green-500" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <textarea
              className={`w-full min-h-[400px] p-4 font-mono text-sm border rounded-xl bg-muted/30 outline-none resize-y ${
                error ? "border-destructive text-destructive" : "border-black/10 dark:border-white/15"
              }`}
              readOnly
              value={error ? `Error:\n${error}` : output}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={handleFormat} className="gap-2 rounded-xl">
            <AlignLeft className="h-4 w-4" /> Format JSON
          </Button>
          <Button onClick={handleMinify} variant="outline" className="gap-2 rounded-xl">
            <Minimize className="h-4 w-4" /> Minify JSON
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
