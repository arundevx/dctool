import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StaticPageProps {
  title: string;
  description?: string;
  lastUpdated?: string;
  children: React.ReactNode;
  className?: string;
}

export function StaticPage({ title, description, lastUpdated, children, className }: StaticPageProps) {
  return (
    <div className="w-full min-h-screen bg-background grid-pattern relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-background to-transparent pointer-events-none -z-10" />
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16 max-w-3xl">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-indigo-500 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{title}</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">{title}</h1>
          {description && (
            <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
          )}
          {lastUpdated && (
            <p className="text-sm text-muted-foreground mt-4">Last updated: {lastUpdated}</p>
          )}
        </header>

        <article
          className={cn(
            "glass-panel rounded-3xl p-6 md:p-10 prose prose-neutral dark:prose-invert max-w-none",
            "prose-headings:font-bold prose-headings:tracking-tight",
            "prose-a:text-indigo-600 dark:prose-a:text-indigo-400",
            "prose-li:marker:text-muted-foreground",
            className
          )}
        >
          {children}
        </article>
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="not-prose mb-10 last:mb-0">
      <h2 className="text-xl font-bold mb-3 text-foreground">{title}</h2>
      <div className="text-muted-foreground leading-relaxed space-y-3 text-[15px]">{children}</div>
    </section>
  );
}
