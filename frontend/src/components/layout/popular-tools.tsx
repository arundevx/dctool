import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { POPULAR_TOOLS } from "@/lib/tools";
import { getToolListIcon } from "@/lib/tool-icons";
import { cn } from "@/lib/utils";

export function PopularTools() {
  return (
    <section className="w-full py-12 px-4 md:px-8 container mx-auto relative z-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          Popular Tools
        </h2>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Jump straight to the tools people use most.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-6xl mx-auto">
        {POPULAR_TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href} className="group">
            <article
              className={cn(
                "relative h-full flex flex-col rounded-2xl border border-black/10 dark:border-white/15 bg-white dark:bg-white/[0.04] p-4 transition-all duration-200",
                "shadow-sm shadow-black/[0.04] dark:shadow-none",
                "hover:-translate-y-0.5 hover:border-indigo-400/40 dark:hover:border-indigo-500/30 hover:shadow-[0_8px_30px_-12px_rgba(99,102,241,0.25)]"
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 group-hover:bg-indigo-500/15 group-hover:border-indigo-500/30 transition-colors">
                  {getToolListIcon(tool.href, tool.category, tool.colorTheme)}
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-indigo-500 opacity-0 -translate-y-0.5 translate-x-0.5 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" />
              </div>
              <h3 className="font-semibold text-sm leading-snug mb-1.5">{tool.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {tool.description}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
