import { Search } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { ToolList } from "@/components/ui/tool-list";
import { getToolsByCategoryForList } from "@/lib/tool-helpers";
import { CATEGORY_META } from "@/lib/tools";

export const metadata = constructMetadata({
  title: "SEO Tools",
  description: "Free online SEO tools including meta tags, sitemaps, slug generator, word counter, and more.",
  path: "/tools/seo",
});

export default function SeoToolsPage() {
  const tools = getToolsByCategoryForList("seo");

  return (
    <div className="w-full min-h-screen grid-pattern relative">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-background to-transparent pointer-events-none -z-10" />

      <div className="container mx-auto py-16 px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mb-20 text-center mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-4 bg-orange-500/10 border border-orange-500/20 rounded-3xl mb-8 shadow-[0_0_40px_-10px_rgba(249,115,22,0.3)]">
            <Search className="h-12 w-12 text-orange-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-600 text-glow">
            {CATEGORY_META.seo.label}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto text-balance">
            Boost your website&apos;s search visibility with meta tags, content tools, URL utilities, and more.
          </p>
        </div>

        <ToolList tools={tools} colorTheme="amber" />
      </div>
    </div>
  );
}
