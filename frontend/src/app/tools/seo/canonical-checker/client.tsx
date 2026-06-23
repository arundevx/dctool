"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { CATEGORY_META } from "@/lib/tools";
import { canonicalizeUrl } from "@/lib/text-utils";

export default function CanonicalCheckerClient() {
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");

  const resultA = useMemo(() => canonicalizeUrl(urlA), [urlA]);
  const resultB = useMemo(() => canonicalizeUrl(urlB), [urlB]);

  const match =
    resultA.canonical && resultB.canonical
      ? resultA.canonical === resultB.canonical
      : null;

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(CATEGORY_META.seo.label, CATEGORY_META.seo.href, "Canonical URL Checker")}
      title="Canonical URL Checker"
      description="Normalize URLs and check if two URLs resolve to the same canonical form."
      icon={<Link className="h-10 w-10 text-amber-500" />}
      colorTheme="amber"
      privacyMode="browser"
      maxWidth="4xl"
    >
      <div className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">URL A</label>
            <Input
              value={urlA}
              onChange={(e) => setUrlA(e.target.value)}
              placeholder="https://example.com/page?utm_source=google"
              className="h-11 rounded-xl font-mono text-sm"
            />
            {urlA && (
              <p className="text-xs font-mono text-muted-foreground break-all">
                {resultA.error ? (
                  <span className="text-destructive">{resultA.error}</span>
                ) : (
                  <>Canonical: {resultA.canonical}</>
                )}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">URL B</label>
            <Input
              value={urlB}
              onChange={(e) => setUrlB(e.target.value)}
              placeholder="https://www.example.com/page/"
              className="h-11 rounded-xl font-mono text-sm"
            />
            {urlB && (
              <p className="text-xs font-mono text-muted-foreground break-all">
                {resultB.error ? (
                  <span className="text-destructive">{resultB.error}</span>
                ) : (
                  <>Canonical: {resultB.canonical}</>
                )}
              </p>
            )}
          </div>
        </div>

        {match !== null && (
          <div
            className={`p-4 rounded-xl text-center font-medium ${
              match
                ? "bg-green-500/10 text-green-700 dark:text-green-400"
                : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
            }`}
          >
            {match
              ? "These URLs are canonical equivalents."
              : "These URLs are NOT canonical equivalents."}
          </div>
        )}

        <div className="text-sm text-muted-foreground space-y-1">
          <p>Normalization includes:</p>
          <ul className="list-disc list-inside text-xs space-y-0.5">
            <li>Lowercase hostname</li>
            <li>Default port removal (80/443)</li>
            <li>Trailing slash trimming on paths</li>
            <li>Sorted query parameters</li>
            <li>Fragment (#) removal</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
