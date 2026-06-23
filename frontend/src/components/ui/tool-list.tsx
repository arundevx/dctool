"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Tool = {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
};

interface ToolListProps {
  tools: Tool[];
  colorTheme: "blue" | "rose" | "violet" | "amber" | "indigo";
  searchPlaceholder?: string;
}

const themeStyles = {
  blue: {
    ring: "focus-visible:ring-blue-500/40",
    card: "border-black/10 dark:border-white/15 hover:border-blue-400/40 dark:hover:border-blue-500/30 hover:shadow-[0_8px_30px_-12px_rgba(59,130,246,0.25)]",
    icon: "bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500/15 group-hover:border-blue-500/30",
    arrow: "text-blue-500",
  },
  rose: {
    ring: "focus-visible:ring-rose-500/40",
    card: "border-black/10 dark:border-white/15 hover:border-rose-400/40 dark:hover:border-rose-500/30 hover:shadow-[0_8px_30px_-12px_rgba(244,63,94,0.25)]",
    icon: "bg-rose-500/10 border-rose-500/20 group-hover:bg-rose-500/15 group-hover:border-rose-500/30",
    arrow: "text-rose-500",
  },
  violet: {
    ring: "focus-visible:ring-violet-500/40",
    card: "border-black/10 dark:border-white/15 hover:border-violet-400/40 dark:hover:border-violet-500/30 hover:shadow-[0_8px_30px_-12px_rgba(139,92,246,0.25)]",
    icon: "bg-violet-500/10 border-violet-500/20 group-hover:bg-violet-500/15 group-hover:border-violet-500/30",
    arrow: "text-violet-500",
  },
  amber: {
    ring: "focus-visible:ring-amber-500/40",
    card: "border-black/10 dark:border-white/15 hover:border-amber-400/40 dark:hover:border-amber-500/30 hover:shadow-[0_8px_30px_-12px_rgba(245,158,11,0.25)]",
    icon: "bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500/15 group-hover:border-amber-500/30",
    arrow: "text-amber-500",
  },
  indigo: {
    ring: "focus-visible:ring-indigo-500/40",
    card: "border-black/10 dark:border-white/15 hover:border-indigo-400/40 dark:hover:border-indigo-500/30 hover:shadow-[0_8px_30px_-12px_rgba(99,102,241,0.25)]",
    icon: "bg-indigo-500/10 border-indigo-500/20 group-hover:bg-indigo-500/15 group-hover:border-indigo-500/30",
    arrow: "text-indigo-500",
  },
};

function renderToolIcon(icon: React.ReactNode) {
  if (!React.isValidElement<{ className?: string }>(icon)) return icon;

  return React.cloneElement(icon, {
    className: cn("h-5 w-5 shrink-0", icon.props.className),
  });
}

export function ToolList({
  tools,
  colorTheme,
  searchPlaceholder = "Search tools...",
}: ToolListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const theme = themeStyles[colorTheme];

  const filteredTools = tools.filter(
    (tool) =>
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="max-w-md mx-auto mb-8 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          className={cn(
            "pl-10 h-11 rounded-xl border-black/10 dark:border-white/15 bg-white dark:bg-white/5 shadow-sm text-sm",
            theme.ring
          )}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {filteredTools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group">
              <article
                className={cn(
                  "relative h-full flex flex-col rounded-2xl border bg-white dark:bg-white/[0.04] p-4 transition-all duration-200",
                  "shadow-sm shadow-black/[0.04] dark:shadow-none",
                  "hover:-translate-y-0.5",
                  theme.card
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200",
                      theme.icon
                    )}
                  >
                    {renderToolIcon(tool.icon)}
                  </div>
                  <ArrowUpRight
                    className={cn(
                      "h-4 w-4 shrink-0 opacity-0 -translate-y-0.5 translate-x-0.5 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0",
                      theme.arrow
                    )}
                  />
                </div>

                <h3 className="font-semibold text-sm leading-snug mb-1.5 group-hover:text-foreground transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                  {tool.description}
                </p>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border border-black/10 dark:border-white/15 bg-white dark:bg-white/[0.04] shadow-sm">
          <p className="text-sm text-muted-foreground">
            No tools found matching &ldquo;{searchQuery}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
