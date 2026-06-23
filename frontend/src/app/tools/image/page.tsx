import { Image } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { ToolList } from "@/components/ui/tool-list";
import { getToolsByCategoryForList } from "@/lib/tool-helpers";
import { CATEGORY_META } from "@/lib/tools";

export const metadata = constructMetadata({
  title: "Image Tools",
  description: "Free online image tools including converters, compressors, resizers, and croppers.",
  path: "/tools/image",
});

export default function ImageToolsPage() {
  const tools = getToolsByCategoryForList("image");

  return (
    <div className="w-full min-h-screen grid-pattern relative">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-background to-transparent pointer-events-none -z-10" />

      <div className="container mx-auto py-16 px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mb-16 text-center mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-3xl mb-8 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]">
            <Image className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 text-glow">
            {CATEGORY_META.image.label}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto text-balance">
            Powerful, fast, and free online utilities to convert, compress, and edit your images.
          </p>
        </div>

        <ToolList tools={tools} colorTheme="blue" searchPlaceholder="Search image tools..." />
      </div>
    </div>
  );
}
