"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Hash } from "lucide-react";
import { DualPanelTool, toolBreadcrumbs } from "@/components/tools/dual-panel-tool";
import { CATEGORY_META } from "@/lib/tools";

export default function Base64Client() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const { output, error } = React.useMemo(() => {
    if (!input) return { output: "", error: null as string | null };
    try {
      if (mode === "encode") {
        return { output: btoa(unescape(encodeURIComponent(input))), error: null };
      }
      return { output: decodeURIComponent(escape(atob(input))), error: null };
    } catch {
      return { output: "", error: `Invalid input for ${mode}` };
    }
  }, [input, mode]);

  const toggleMode = () => {
    setMode((m) => (m === "encode" ? "decode" : "encode"));
    setInput(output || input);
  };

  return (
    <DualPanelTool
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.developer.label, CATEGORY_META.developer.href, "Base64")}
      title={`Base64 ${mode === "encode" ? "Encoder" : "Decoder"}`}
      description={`Instantly ${mode} text to and from Base64 format in your browser.`}
      icon={<Hash className="h-10 w-10 text-violet-500" />}
      toolHref="/tools/developer/base64"
      inputLabel={mode === "encode" ? "Plain text" : "Base64 string"}
      outputLabel={mode === "encode" ? "Base64 output" : "Decoded text"}
      input={input}
      output={output}
      onInputChange={setInput}
      error={error}
      headerActions={
        <Button variant="outline" onClick={toggleMode} className="gap-2">
          <ArrowRightLeft className="h-4 w-4" />
          Switch to {mode === "encode" ? "Decode" : "Encode"}
        </Button>
      }
    />
  );
}
