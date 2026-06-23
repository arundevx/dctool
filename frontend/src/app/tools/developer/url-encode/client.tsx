"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Link2 } from "lucide-react";
import { DualPanelTool, toolBreadcrumbs } from "@/components/tools/dual-panel-tool";
import { CATEGORY_META } from "@/lib/tools";

export default function UrlEncodeClient() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const { output, error } = React.useMemo(() => {
    if (!input) return { output: "", error: null as string | null };
    try {
      if (mode === "encode") {
        return { output: encodeURIComponent(input), error: null };
      }
      return { output: decodeURIComponent(input.replace(/\+/g, " ")), error: null };
    } catch {
      return { output: "", error: "Invalid input for decoding" };
    }
  }, [input, mode]);

  const toggleMode = () => {
    setMode((m) => (m === "encode" ? "decode" : "encode"));
    setInput(output || input);
  };

  return (
    <DualPanelTool
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.developer.label, CATEGORY_META.developer.href, "URL Encode/Decode")}
      title={`URL ${mode === "encode" ? "Encoder" : "Decoder"}`}
      description={`Instantly ${mode} URLs and query strings in your browser.`}
      icon={<Link2 className="h-10 w-10 text-violet-500" />}
      inputLabel={mode === "encode" ? "Plain text / URL" : "Encoded URL"}
      outputLabel={mode === "encode" ? "Encoded output" : "Decoded output"}
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
