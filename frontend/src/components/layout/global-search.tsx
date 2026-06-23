"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { searchTools, type Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

const categoryBadgeColors: Record<Tool["category"], string> = {
  image: "text-blue-500 bg-blue-500/10",
  pdf: "text-rose-500 bg-rose-500/10",
  developer: "text-violet-500 bg-violet-500/10",
  seo: "text-amber-500 bg-amber-500/10",
  downloader: "text-indigo-500 bg-indigo-500/10",
};

interface GlobalSearchProps {
  /** Full-width hero-style trigger for the homepage */
  hero?: boolean;
}

export function GlobalSearch({ hero = false }: GlobalSearchProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Tool[]>(searchTools(""));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    setResults(searchTools(query));
  }, [query]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  return (
    <>
      {hero ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 h-14 w-full max-w-xl px-5 rounded-2xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-muted-foreground transition-colors shadow-sm"
          aria-label="Search tools"
        >
          <Search className="h-5 w-5 shrink-0" />
          <span className="flex-1 text-left text-base">Search 50+ free tools...</span>
          <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded border border-black/10 dark:border-white/15 bg-muted">
            Ctrl K
          </kbd>
        </button>
      ) : (
        <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 h-9 w-56 lg:w-64 px-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-muted-foreground transition-colors"
        aria-label="Search tools"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">Search tools...</span>
        <kbd className="hidden lg:inline text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/10 bg-black/20">
          Ctrl K
        </kbd>
      </button>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center justify-center h-9 w-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground transition-colors"
        aria-label="Search tools"
      >
        <Search className="h-4 w-4" />
      </button>
        </>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden glass-panel border-white/10" showCloseButton>
          <DialogTitle className="sr-only">Search tools</DialogTitle>
          <div className="flex items-center gap-2 px-4 border-b border-white/10">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              autoFocus
              placeholder="Search tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 h-12 bg-transparent"
            />
          </div>

          <div className="max-h-72 overflow-y-auto p-2">
            {results.length > 0 ? (
              results.map((tool) => (
                <button
                  key={tool.href}
                  type="button"
                  onClick={() => navigate(tool.href)}
                  className="w-full text-left flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium truncate">{tool.title}</span>
                      <span
                        className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0",
                          categoryBadgeColors[tool.category]
                        )}
                      >
                        {tool.categoryLabel}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {tool.description}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground py-8">
                No tools found for &ldquo;{query}&rdquo;
              </p>
            )}
          </div>

          <div className="px-4 py-2 border-t border-white/10 text-[11px] text-muted-foreground">
            Tip: press <kbd className="font-mono px-1 rounded border border-white/10">↑</kbd>{" "}
            <kbd className="font-mono px-1 rounded border border-white/10">↓</kbd> to browse,{" "}
            <kbd className="font-mono px-1 rounded border border-white/10">Enter</kbd> to open
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
