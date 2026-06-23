"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { ToolLayout, toolBreadcrumbs, type BreadcrumbItem } from "@/components/layout/tool-layout";
import type { ToolColorTheme } from "@/lib/tools";

interface DualPanelToolProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description: string;
  icon: React.ReactNode;
  colorTheme?: ToolColorTheme;
  inputLabel?: string;
  outputLabel?: string;
  input: string;
  output: string;
  onInputChange: (value: string) => void;
  inputPlaceholder?: string;
  error?: string | null;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  readOnlyOutput?: boolean;
  maxWidth?: "4xl" | "5xl" | "6xl";
  toolHref?: string;
}

export function DualPanelTool({
  breadcrumbs,
  title,
  description,
  icon,
  colorTheme = "violet",
  inputLabel = "Input",
  outputLabel = "Output",
  input,
  output,
  onInputChange,
  inputPlaceholder = "Paste text here...",
  error,
  headerActions,
  footer,
  readOnlyOutput = true,
  maxWidth = "6xl",
  toolHref,
}: DualPanelToolProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      breadcrumbs={breadcrumbs}
      title={title}
      description={description}
      icon={icon}
      colorTheme={colorTheme}
      privacyMode="browser"
      maxWidth={maxWidth}
      toolHref={toolHref}
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8">
        {headerActions && <div className="mb-6 flex flex-wrap gap-2">{headerActions}</div>}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">{inputLabel}</label>
            <textarea
              className="w-full min-h-[320px] p-4 font-mono text-sm border border-black/10 dark:border-white/15 rounded-xl bg-background focus:ring-2 focus:ring-violet-500 outline-none resize-y"
              placeholder={inputPlaceholder}
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">{outputLabel}</label>
              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output && !error}>
                {copied ? <Check className="h-4 w-4 mr-1 text-green-500" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <textarea
              className={`w-full min-h-[320px] p-4 font-mono text-sm border rounded-xl bg-muted/30 outline-none resize-y ${
                error ? "border-destructive text-destructive" : "border-black/10 dark:border-white/15"
              }`}
              readOnly={readOnlyOutput}
              value={error || output}
              onChange={readOnlyOutput ? undefined : (e) => onInputChange(e.target.value)}
            />
          </div>
        </div>
        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </ToolLayout>
  );
}

export { toolBreadcrumbs };
