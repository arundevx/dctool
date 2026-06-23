import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, Shield, Monitor } from "lucide-react";
import type { ToolColorTheme } from "@/lib/tools";
import { RelatedToolsAuto } from "@/components/layout/related-tools-auto";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ToolLayoutProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description: string;
  icon: ReactNode;
  colorTheme?: ToolColorTheme;
  privacyMode?: "server" | "browser";
  fileLimit?: string;
  children: ReactNode;
  maxWidth?: "4xl" | "5xl" | "6xl";
  toolHref?: string;
}

const gradientMap: Record<ToolColorTheme, string> = {
  blue: "from-blue-500/10",
  rose: "from-rose-500/10",
  violet: "from-violet-500/10",
  amber: "from-amber-500/10",
  fuchsia: "from-fuchsia-500/10",
  indigo: "from-indigo-500/10",
};

const iconBgMap: Record<ToolColorTheme, string> = {
  blue: "bg-blue-500/10 border-blue-500/20 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]",
  rose: "bg-rose-500/10 border-rose-500/20 shadow-[0_0_40px_-10px_rgba(244,63,94,0.3)]",
  violet: "bg-violet-500/10 border-violet-500/20 shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)]",
  amber: "bg-amber-500/10 border-amber-500/20 shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)]",
  fuchsia: "bg-fuchsia-500/10 border-fuchsia-500/20 shadow-[0_0_40px_-10px_rgba(217,70,239,0.3)]",
  indigo: "bg-indigo-500/10 border-indigo-500/20 shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)]",
};

const titleGradientMap: Record<ToolColorTheme, string> = {
  blue: "from-blue-400 to-indigo-600",
  rose: "from-red-400 to-rose-600",
  violet: "from-violet-400 to-purple-600",
  amber: "from-orange-400 to-amber-600",
  fuchsia: "from-fuchsia-400 to-pink-600",
  indigo: "from-indigo-400 to-purple-600",
};

const maxWidthMap = {
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
};

export function ToolLayout({
  breadcrumbs,
  title,
  description,
  icon,
  colorTheme = "blue",
  privacyMode,
  fileLimit,
  children,
  maxWidth = "4xl",
  toolHref,
}: ToolLayoutProps) {
  return (
    <div className="w-full min-h-screen grid-pattern relative">
      <div
        className={cn(
          "absolute top-0 left-0 w-full h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] via-background to-transparent pointer-events-none -z-10",
          gradientMap[colorTheme]
        )}
      />

      <div
        className={cn(
          "container mx-auto py-12 md:py-16 px-4 md:px-8 relative z-10",
          maxWidthMap[maxWidth],
          "mx-auto"
        )}
      >
        <nav aria-label="Breadcrumb" className="mb-8 animate-in fade-in duration-500">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            {breadcrumbs.map((item, index) => (
              <li key={`${item.label}-${index}`} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div
            className={cn(
              "inline-flex items-center justify-center p-4 border rounded-3xl mb-6",
              iconBgMap[colorTheme]
            )}
          >
            {icon}
          </div>
          <h1
            className={cn(
              "text-3xl md:text-4xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r",
              titleGradientMap[colorTheme]
            )}
          >
            {title}
          </h1>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">{description}</p>

          {(privacyMode || fileLimit) && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
              {privacyMode === "server" && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Shield className="h-3.5 w-3.5" />
                  Processed securely, deleted after download
                </span>
              )}
              {privacyMode === "browser" && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <Monitor className="h-3.5 w-3.5" />
                  Runs entirely in your browser — nothing uploaded
                </span>
              )}
              {fileLimit && (
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted text-muted-foreground border border-border">
                  Max file size: {fileLimit}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          {children}
          <RelatedToolsAuto toolHref={toolHref} colorTheme={colorTheme} />
        </div>
      </div>
    </div>
  );
}

export function toolBreadcrumbs(
  categoryLabel: string,
  categoryHref: string,
  toolTitle: string
): BreadcrumbItem[] {
  return [
    { label: "Home", href: "/" },
    { label: categoryLabel, href: categoryHref },
    { label: toolTitle },
  ];
}
