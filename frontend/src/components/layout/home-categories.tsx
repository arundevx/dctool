import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_META } from "@/lib/tools";
import { Image, FileText, Download, Code, Search } from "lucide-react";

const categories = [
  {
    ...CATEGORY_META.image,
    title: CATEGORY_META.image.label,
    description: "Compress, resize, crop, convert, and watermark images.",
    icon: <Image className="h-8 w-8 text-blue-500" />,
  },
  {
    ...CATEGORY_META.pdf,
    title: CATEGORY_META.pdf.label,
    description: "Merge, split, compress, sign, and convert PDF documents.",
    icon: <FileText className="h-8 w-8 text-rose-500" />,
  },
  {
    ...CATEGORY_META.developer,
    title: CATEGORY_META.developer.label,
    description: "Format JSON, encode URLs, generate hashes, UUIDs, and more.",
    icon: <Code className="h-8 w-8 text-violet-500" />,
  },
  {
    ...CATEGORY_META.seo,
    title: CATEGORY_META.seo.label,
    description: "Meta tags, sitemaps, slug generator, word counter, and more.",
    icon: <Search className="h-8 w-8 text-amber-500" />,
  },
  {
    ...CATEGORY_META.downloader,
    title: CATEGORY_META.downloader.label,
    description: "Download videos and audio from supported websites.",
    icon: <Download className="h-8 w-8 text-indigo-500" />,
  },
];

export function HomeCategories() {
  return (
    <section className="w-full py-16 px-4 md:px-8 container mx-auto relative z-10">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Browse by Category</h2>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Explore our full collection organized by what you need to do.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {categories.map((category) => (
          <Link key={category.href} href={category.href} className="group">
            <Card className="glass-panel h-full hover:-translate-y-1 transition-all duration-300 border-black/10 dark:border-white/10">
              <CardHeader>
                <div className="mb-4 w-14 h-14 rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <CardTitle className="text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{category.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
