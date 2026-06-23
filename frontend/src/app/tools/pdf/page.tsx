import { FileText } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { ToolList } from "@/components/ui/tool-list";
import { getToolsByCategoryForList } from "@/lib/tool-helpers";
import { CATEGORY_META } from "@/lib/tools";

export const metadata = constructMetadata({
  title: "PDF Tools",
  description: "Free online PDF tools to merge, compress, split, convert, and watermark your documents securely.",
  path: "/tools/pdf",
});

export default function PdfToolsPage() {
  const tools = getToolsByCategoryForList("pdf");

  return (
    <div className="w-full min-h-screen grid-pattern relative">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-500/10 via-background to-transparent pointer-events-none -z-10" />

      <div className="container mx-auto py-16 px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mb-16 text-center mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-4 bg-rose-500/10 border border-rose-500/20 rounded-3xl mb-8 shadow-[0_0_40px_-10px_rgba(244,63,94,0.3)]">
            <FileText className="h-12 w-12 text-rose-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-rose-600 text-glow">
            {CATEGORY_META.pdf.label}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto text-balance">
            Manage your PDF documents securely. All processing is done efficiently with strict privacy.
          </p>
        </div>

        <ToolList tools={tools} colorTheme="rose" searchPlaceholder="Search PDF tools..." />
      </div>
    </div>
  );
}
