"use client";

import React, { useState, useEffect } from "react";
import { Fingerprint } from "lucide-react";
import { DualPanelTool, toolBreadcrumbs } from "@/components/tools/dual-panel-tool";
import { CATEGORY_META } from "@/lib/tools";
import { md5, sha256 } from "@/lib/md5";

export default function HashGeneratorClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (!input) {
      setOutput("");
      return;
    }
    let cancelled = false;
    (async () => {
      const sha = await sha256(input);
      if (!cancelled) {
        setOutput(`MD5:     ${md5(input)}\nSHA-256: ${sha}`);
      }
    })();
    return () => { cancelled = true; };
  }, [input]);

  return (
    <DualPanelTool
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.developer.label, CATEGORY_META.developer.href, "Hash Generator")}
      title="Hash Generator"
      description="Generate MD5 and SHA-256 hashes from any text. All processing happens in your browser."
      icon={<Fingerprint className="h-10 w-10 text-violet-500" />}
      inputLabel="Input text"
      outputLabel="Hashes"
      input={input}
      output={output}
      onInputChange={setInput}
      inputPlaceholder="Enter text to hash..."
    />
  );
}
