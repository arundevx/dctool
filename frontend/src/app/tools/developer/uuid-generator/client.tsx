"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw, Check, Fingerprint } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { CATEGORY_META } from "@/lib/tools";

function generateUUID() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16)
  );
}

export default function UuidGeneratorClient() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = () => {
    const n = Math.min(Math.max(count, 1), 100);
    setUuids(Array.from({ length: n }, generateUUID));
  };

  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = (uuid: string, index: number) => {
    navigator.clipboard.writeText(uuid);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.developer.label, CATEGORY_META.developer.href, "UUID Generator")}
      title="UUID Generator"
      description="Generate random Version 4 UUIDs instantly in your browser."
      icon={<Fingerprint className="h-10 w-10 text-violet-500" />}
      colorTheme="violet"
      privacyMode="browser"
      maxWidth="4xl"
      toolHref="/tools/developer/uuid-generator"
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 p-4 rounded-xl bg-muted/30 border border-black/10 dark:border-white/15">
          <div className="flex-1 space-y-2 w-full">
            <label className="text-sm font-medium">How many UUIDs?</label>
            <Input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="max-w-[200px] h-11 rounded-xl"
            />
          </div>
          <Button onClick={handleGenerate} className="gap-2 rounded-xl w-full sm:w-auto">
            <RefreshCw className="h-4 w-4" /> Generate
          </Button>
        </div>

        {uuids.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">Generated UUIDs</h2>
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(uuids.join("\n"))}>
                <Copy className="h-4 w-4 mr-1" /> Copy All
              </Button>
            </div>
            <div className="border border-black/10 dark:border-white/15 rounded-xl overflow-hidden divide-y divide-black/10 dark:divide-white/10">
              {uuids.map((uuid, index) => (
                <div key={`${uuid}-${index}`} className="flex items-center justify-between p-3 hover:bg-muted/30">
                  <code className="font-mono text-sm">{uuid}</code>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(uuid, index)}>
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
