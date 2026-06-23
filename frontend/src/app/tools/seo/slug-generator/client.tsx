"use client";

import React, { useState, useMemo } from "react";
import { TextCursorInput } from "lucide-react";
import { DualPanelTool, toolBreadcrumbs } from "@/components/tools/dual-panel-tool";
import { CATEGORY_META } from "@/lib/tools";
import { slugify } from "@/lib/text-utils";

export default function SlugGeneratorClient() {
  const [input, setInput] = useState("");
  const output = useMemo(() => (input ? slugify(input) : ""), [input]);

  return (
    <DualPanelTool
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.seo.label, CATEGORY_META.seo.href, "Slug Generator")}
      title="Slug Generator"
      description="Convert titles and phrases into clean, URL-friendly slugs."
      icon={<TextCursorInput className="h-10 w-10 text-amber-500" />}
      colorTheme="amber"
      inputLabel="Title or phrase"
      outputLabel="URL slug"
      input={input}
      output={output}
      onInputChange={setInput}
      inputPlaceholder="My Awesome Blog Post Title"
    />
  );
}
