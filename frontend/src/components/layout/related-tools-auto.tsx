"use client";

import { usePathname } from "next/navigation";
import { RelatedTools } from "@/lib/tool-helpers";
import type { ToolColorTheme } from "@/lib/tools";

interface RelatedToolsAutoProps {
  colorTheme: ToolColorTheme;
  toolHref?: string;
}

export function RelatedToolsAuto({ colorTheme, toolHref }: RelatedToolsAutoProps) {
  const pathname = usePathname();
  const href = toolHref ?? pathname;
  if (!href || href === "/") return null;
  return <RelatedTools currentHref={href} colorTheme={colorTheme} />;
}
