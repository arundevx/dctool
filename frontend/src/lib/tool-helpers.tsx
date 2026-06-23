import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ALL_TOOLS, type Tool, type ToolCategory } from "@/lib/tools";
import { getToolListIcon } from "@/lib/tool-icons";
import { cn } from "@/lib/utils";

export function getToolsByCategoryForList(category: ToolCategory) {
  return ALL_TOOLS.filter((t) => t.category === category).map((t) => ({
    title: t.title,
    description: t.description,
    href: t.href,
    icon: getToolListIcon(t.href, t.category, t.colorTheme),
  }));
}

export function getRelatedTools(currentHref: string, limit = 4): Tool[] {
  const current = ALL_TOOLS.find((t) => t.href === currentHref);
  if (!current) {
    return ALL_TOOLS.filter((t) => t.popular && t.href !== currentHref).slice(0, limit);
  }

  const sameCategory = ALL_TOOLS.filter(
    (t) => t.href !== currentHref && t.category === current.category
  );

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const extras = ALL_TOOLS.filter(
    (t) =>
      t.href !== currentHref &&
      t.category !== current.category &&
      t.popular
  );

  return [...sameCategory, ...extras].slice(0, limit);
}

const themeLinkColor: Record<string, string> = {
  blue: "hover:border-blue-400/40 group-hover:text-blue-500",
  rose: "hover:border-rose-400/40 group-hover:text-rose-500",
  violet: "hover:border-violet-400/40 group-hover:text-violet-500",
  amber: "hover:border-amber-400/40 group-hover:text-amber-500",
  fuchsia: "hover:border-fuchsia-400/40 group-hover:text-fuchsia-500",
  indigo: "hover:border-indigo-400/40 group-hover:text-indigo-500",
};

interface RelatedToolsProps {
  currentHref: string;
  colorTheme?: string;
}

export function RelatedTools({ currentHref, colorTheme = "blue" }: RelatedToolsProps) {
  const related = getRelatedTools(currentHref);
  if (related.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-black/10 dark:border-white/10">
      <h2 className="text-lg font-semibold mb-4">Related tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {related.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={cn(
              "group flex items-center gap-3 p-4 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-white/[0.04] transition-all hover:-translate-y-0.5",
              themeLinkColor[colorTheme]
            )}
          >
            <div className="shrink-0">{getToolListIcon(tool.href, tool.category, tool.colorTheme)}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{tool.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{tool.description}</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
          </Link>
        ))}
      </div>
    </section>
  );
}
