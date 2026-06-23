"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileCode, AlignLeft, Minimize } from "lucide-react";
import { DualPanelTool, toolBreadcrumbs } from "@/components/tools/dual-panel-tool";
import { CATEGORY_META } from "@/lib/tools";
import { load, dump } from "js-yaml";

export default function YamlFormatterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFormat = () => {
    try {
      if (!input.trim()) return;
      const parsed = load(input);
      setOutput(dump(parsed, { indent: 2, lineWidth: 120 }));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid YAML");
      setOutput("");
    }
  };

  const handleMinify = () => {
    try {
      if (!input.trim()) return;
      const parsed = load(input);
      setOutput(dump(parsed, { flowLevel: -1, lineWidth: -1 }).trim());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid YAML");
      setOutput("");
    }
  };

  return (
    <DualPanelTool
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.developer.label, CATEGORY_META.developer.href, "YAML Formatter")}
      title="YAML Formatter"
      description="Format and validate YAML documents in your browser."
      icon={<FileCode className="h-10 w-10 text-violet-500" />}
      toolHref="/tools/developer/yaml-formatter"
      inputLabel="Input YAML"
      outputLabel="Output"
      input={input}
      output={output}
      onInputChange={setInput}
      error={error}
      headerActions={
        <>
          <Button variant="outline" size="sm" onClick={handleFormat} className="gap-1">
            <AlignLeft className="h-4 w-4" /> Format
          </Button>
          <Button variant="outline" size="sm" onClick={handleMinify} className="gap-1">
            <Minimize className="h-4 w-4" /> Compact
          </Button>
        </>
      }
    />
  );
}
