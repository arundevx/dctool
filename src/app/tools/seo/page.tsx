import Link from "next/link";
import { Search, Tags, Map, FileCode2 } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { ToolList } from "@/components/ui/tool-list";

export const metadata = constructMetadata({
  title: "SEO Tools",
  description: "Free online SEO tools including Meta Tag generator, Sitemap generator, and Robots.txt generator.",
  path: "/tools/seo",
});

const tools = [
  {
    title: "Meta Tag Generator",
    description: "Generate optimized HTML meta tags, OpenGraph, and Twitter cards for your website.",
    icon: <Tags className="h-6 w-6 text-orange-500" />,
    href: "/tools/seo/meta-tags",
  },
  {
    title: "Sitemap Generator",
    description: "Easily generate an XML sitemap for your website structure.",
    icon: <Map className="h-6 w-6 text-orange-500" />,
    href: "/tools/seo/sitemap",
  },
  {
    title: "Robots.txt Generator",
    description: "Create a robots.txt file to control how search engines crawl your site.",
    icon: <FileCode2 className="h-6 w-6 text-orange-500" />,
    href: "/tools/seo/robots",
  },
];

export default function SeoToolsPage() {
  return (
    <div className="w-full min-h-screen grid-pattern relative">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-background to-transparent pointer-events-none -z-10"></div>
      
      <div className="container mx-auto py-16 px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mb-20 text-center mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-4 bg-orange-500/10 border border-orange-500/20 rounded-3xl mb-8 shadow-[0_0_40px_-10px_rgba(249,115,22,0.3)]">
            <Search className="h-12 w-12 text-orange-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-600 text-glow">
            SEO Tools
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto text-balance">
            Boost your website's search engine visibility with our free suite of blazing fast SEO utilities.
          </p>
        </div>
        
        <ToolList tools={tools} colorTheme="amber" />
      </div>
    </div>
  );
}
