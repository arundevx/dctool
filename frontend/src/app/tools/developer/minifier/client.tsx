"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Minimize2 } from "lucide-react";
import { DualPanelTool, toolBreadcrumbs } from "@/components/tools/dual-panel-tool";
import { CATEGORY_META } from "@/lib/tools";
import { minifyHtml, minifyCss, minifyJs } from "@/lib/text-utils";

type Mode = "html" | "css" | "js";

export default function MinifierClient() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("html");

  const output = useMemo(() => {
    if (!input) return "";
    if (mode === "html") return minifyHtml(input);
    if (mode === "css") return minifyCss(input);
    return minifyJs(input);
  }, [input, mode]);

  const saved = input.length - output.length;

  return (
    <DualPanelTool
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.developer.label, CATEGORY_META.developer.href, "Minifier")}
      title="HTML / CSS / JS Minifier"
      description="Remove whitespace and comments to shrink your code."
      icon={<Minimize2 className="h-10 w-10 text-violet-500" />}
      inputLabel={`${mode.toUpperCase()} input`}
      outputLabel="Minified output"
      input={input}
      output={output}
      onInputChange={setInput}
      inputPlaceholder={`Paste your ${mode.toUpperCase()} here...`}
      headerActions={
        <>
          {(["html", "css", "js"] as Mode[]).map((m) => (
            <Button
              key={m}
              variant={mode === m ? "default" : "outline"}
              size="sm"
              onClick={() => setMode(m)}
            >
              {m.toUpperCase()}
            </Button>
          ))}
        </>
      }
      footer={
        input && output ? (
          <p className="text-sm text-muted-foreground">
            Saved {saved > 0 ? saved : 0} characters ({input.length} → {output.length})
          </p>
        ) : null
      }
    />
  );
}
