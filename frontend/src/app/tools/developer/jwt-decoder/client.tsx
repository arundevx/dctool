"use client";

import React, { useState, useMemo } from "react";
import { KeyRound } from "lucide-react";
import { DualPanelTool, toolBreadcrumbs } from "@/components/tools/dual-panel-tool";
import { CATEGORY_META } from "@/lib/tools";
import { decodeJwt } from "@/lib/dev-utils";

export default function JwtDecoderClient() {
  const [input, setInput] = useState("");

  const output = useMemo(() => {
    if (!input.trim()) return "";
    const result = decodeJwt(input);
    if ("error" in result) return result.error;
    return JSON.stringify(
      { header: result.header, payload: result.payload, signature: result.signature },
      null,
      2
    );
  }, [input]);

  const error = useMemo(() => {
    if (!input.trim()) return null;
    const result = decodeJwt(input);
    return "error" in result ? result.error : null;
  }, [input]);

  return (
    <DualPanelTool
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.developer.label, CATEGORY_META.developer.href, "JWT Decoder")}
      title="JWT Decoder"
      description="Decode JWT header and payload. Does not verify signatures."
      icon={<KeyRound className="h-10 w-10 text-violet-500" />}
      toolHref="/tools/developer/jwt-decoder"
      inputLabel="JWT token"
      outputLabel="Decoded JSON"
      input={input}
      output={error ? "" : output}
      onInputChange={setInput}
      error={error}
      inputPlaceholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    />
  );
}
