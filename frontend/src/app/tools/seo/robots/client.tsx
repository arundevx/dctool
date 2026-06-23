"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, FileCode2, Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToolLayout, toolBreadcrumbs } from "@/components/layout/tool-layout";
import { CATEGORY_META } from "@/lib/tools";

export default function RobotsClient() {
  const [defaultPolicy, setDefaultPolicy] = useState("Allow");
  const [crawlDelay, setCrawlDelay] = useState("");
  const [sitemap, setSitemap] = useState("");
  const [rules, setRules] = useState([{ userAgent: "*", disallow: "/admin/" }]);
  const [copied, setCopied] = useState(false);

  const generateRobotsTxt = () => {
    let output = "";

    rules.forEach((rule) => {
      output += `User-agent: ${rule.userAgent}\n`;
      if (defaultPolicy === "Disallow") {
        output += `Disallow: /\n`;
      } else if (rule.disallow) {
        output += `Disallow: ${rule.disallow}\n`;
      }
      if (crawlDelay) {
        output += `Crawl-delay: ${crawlDelay}\n`;
      }
      output += "\n";
    });

    if (sitemap) {
      output += `Sitemap: ${sitemap}\n`;
    }

    return output.trim();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateRobotsTxt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      breadcrumbs={toolBreadcrumbs(
        CATEGORY_META.seo.label,
        CATEGORY_META.seo.href,
        "Robots.txt Generator"
      )}
      title="Robots.txt Generator"
      description="Easily generate a robots.txt file to control how search engines crawl your site."
      icon={<FileCode2 className="h-10 w-10 text-amber-500" />}
      colorTheme="amber"
      privacyMode="browser"
      maxWidth="6xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8 glass-panel p-6 md:p-8 rounded-3xl">
          <div className="space-y-3">
            <label className="text-sm font-medium text-amber-500">Default Policy (All Robots)</label>
            <Select value={defaultPolicy} onValueChange={(val) => setDefaultPolicy(val as string)}>
              <SelectTrigger className="h-12 glass-panel border-white/10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-panel border-white/10 text-foreground">
                <SelectItem value="Allow">Allow (Let search engines index everything)</SelectItem>
                <SelectItem value="Disallow">Disallow (Block search engines entirely)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-amber-500">Sitemap URL (Optional)</label>
            <Input
              className="h-12 glass-panel border-white/10 rounded-xl"
              placeholder="e.g. https://dreamconsole.org/sitemap.xml"
              value={sitemap}
              onChange={(e) => setSitemap(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-amber-500">Crawl-Delay (Optional, seconds)</label>
            <Input
              className="h-12 glass-panel border-white/10 rounded-xl"
              type="number"
              placeholder="e.g. 10"
              value={crawlDelay}
              onChange={(e) => setCrawlDelay(e.target.value)}
            />
          </div>

          <div className="space-y-4 bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="font-semibold text-lg text-amber-500">Rules</h3>
            {rules.map((rule, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground/80 mb-1 block">User-agent</label>
                    <Input
                      className="h-12 glass-panel border-white/10 rounded-xl"
                      value={rule.userAgent}
                      onChange={(e) => {
                        const newRules = [...rules];
                        newRules[idx].userAgent = e.target.value;
                        setRules(newRules);
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground/80 mb-1 block">Disallow Path</label>
                    <Input
                      className="h-12 glass-panel border-white/10 rounded-xl"
                      value={rule.disallow}
                      disabled={defaultPolicy === "Disallow"}
                      onChange={(e) => {
                        const newRules = [...rules];
                        newRules[idx].disallow = e.target.value;
                        setRules(newRules);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 glass-panel p-6 md:p-8 rounded-3xl h-full flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-amber-500">Generated robots.txt</h2>
            <Button className="glass-button rounded-full px-6" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied!" : "Copy Text"}
            </Button>
          </div>
          <textarea
            className="w-full flex-1 min-h-[400px] p-6 font-mono text-sm border border-white/10 rounded-2xl bg-black/40 focus:ring-2 focus:ring-amber-500 outline-none resize-none text-amber-100"
            readOnly
            value={generateRobotsTxt()}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
