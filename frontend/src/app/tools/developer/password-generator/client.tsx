"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Copy, Check, RefreshCw } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { CATEGORY_META } from "@/lib/tools";
import { generatePassword } from "@/lib/dev-utils";

export default function PasswordGeneratorClient() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setPassword(generatePassword(Math.min(64, Math.max(8, length)), opts));
  };

  React.useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.developer.label, CATEGORY_META.developer.href, "Password Generator")}
      title="Password Generator"
      description="Create strong random passwords using secure browser cryptography."
      icon={<Lock className="h-10 w-10 text-violet-500" />}
      colorTheme="violet"
      privacyMode="browser"
      maxWidth="4xl"
      toolHref="/tools/developer/password-generator"
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
        <div className="flex gap-2">
          <Input readOnly value={password} className="h-12 rounded-xl font-mono text-lg flex-1" />
          <Button variant="outline" size="icon" className="h-12 w-12 shrink-0" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button size="icon" className="h-12 w-12 shrink-0" onClick={handleGenerate}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Length: {length}</label>
          <input type="range" min={8} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-violet-500" />
        </div>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(opts) as (keyof typeof opts)[]).map((key) => (
            <Button
              key={key}
              variant={opts[key] ? "default" : "outline"}
              size="sm"
              onClick={() => setOpts({ ...opts, [key]: !opts[key] })}
              className="capitalize"
            >
              {key}
            </Button>
          ))}
        </div>

        <Button onClick={handleGenerate} className="w-full h-11 rounded-xl">Generate New Password</Button>
      </div>
    </ToolLayout>
  );
}
