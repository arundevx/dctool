"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ListX } from "lucide-react";
import { DualPanelTool, toolBreadcrumbs } from "@/components/tools/dual-panel-tool";
import { CATEGORY_META } from "@/lib/tools";
import { removeDuplicateLines } from "@/lib/text-utils";

export default function RemoveDuplicateLinesClient() {
  const [input, setInput] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);

  const output = useMemo(
    () => (input ? removeDuplicateLines(input, caseSensitive) : ""),
    [input, caseSensitive]
  );

  const removed = input ? input.split("\n").length - output.split("\n").length : 0;

  return (
    <DualPanelTool
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.seo.label, CATEGORY_META.seo.href, "Remove Duplicates")}
      title="Remove Duplicate Lines"
      description="Strip duplicate lines from your text while keeping the first occurrence."
      icon={<ListX className="h-10 w-10 text-amber-500" />}
      colorTheme="amber"
      inputLabel="Input text"
      outputLabel="Deduplicated output"
      input={input}
      output={output}
      onInputChange={setInput}
      headerActions={
        <Button
          variant={caseSensitive ? "default" : "outline"}
          size="sm"
          onClick={() => setCaseSensitive((v) => !v)}
        >
          Case {caseSensitive ? "sensitive" : "insensitive"}
        </Button>
      }
      footer={
        input ? (
          <p className="text-sm text-muted-foreground">
            Removed {removed} duplicate line{removed !== 1 ? "s" : ""}
          </p>
        ) : null
      }
    />
  );
}
