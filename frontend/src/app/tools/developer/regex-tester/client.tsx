"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Regex } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { CATEGORY_META } from "@/lib/tools";
import { testRegex } from "@/lib/dev-utils";

const FLAG_OPTIONS = ["g", "i", "m", "s"];

export default function RegexTesterClient() {
  const [pattern, setPattern] = useState("");
  const [text, setText] = useState("");
  const [flags, setFlags] = useState<string[]>(["g"]);

  const result = useMemo(() => testRegex(pattern, flags.join(""), text), [pattern, flags, text]);

  const toggleFlag = (f: string) => {
    setFlags((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.developer.label, CATEGORY_META.developer.href, "Regex Tester")}
      title="Regex Tester"
      description="Test regular expressions and see all matches highlighted."
      icon={<Regex className="h-10 w-10 text-violet-500" />}
      colorTheme="violet"
      privacyMode="browser"
      maxWidth="5xl"
      toolHref="/tools/developer/regex-tester"
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium">Flags:</span>
          {FLAG_OPTIONS.map((f) => (
            <Button key={f} variant={flags.includes(f) ? "default" : "outline"} size="sm" onClick={() => toggleFlag(f)}>
              {f}
            </Button>
          ))}
        </div>
        <input
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="Regular expression pattern"
          className="w-full h-11 px-4 font-mono text-sm rounded-xl border border-black/10 dark:border-white/15 bg-background"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Test string..."
          className="w-full min-h-[200px] p-4 font-mono text-sm rounded-xl border border-black/10 dark:border-white/15 bg-background resize-y"
        />
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {result.error ? (
              <span className="text-destructive">{result.error}</span>
            ) : (
              <>Matches: {result.groups.length}</>
            )}
          </p>
          {result.groups.length > 0 && (
            <div className="rounded-xl border border-black/10 dark:border-white/15 p-4 font-mono text-sm space-y-1 max-h-[200px] overflow-y-auto">
              {result.groups.map((m, i) => (
                <div key={i} className="text-green-600 dark:text-green-400">{m}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
