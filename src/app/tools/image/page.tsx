import Link from "next/link";
import { Image, ArrowRightLeft, Minimize2, Wand2 } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import ImageToolsClient from "./client";

export const metadata = constructMetadata({
  title: "Image Tools",
  description: "Free online image tools including converters, compressors, resizers, and croppers.",
  path: "/tools/image",
});

const tools = [
  {
    title: "AI Background Remover",
    description: "Instantly erase backgrounds from any image using advanced AI.",
    icon: <Wand2 className="h-6 w-6 text-fuchsia-500" />,
    href: "/tools/image/remove-bg",
  },
  {
    title: "JPG to PNG",
    description: "Instantly convert your JPG images to high-quality transparent PNG format.",
    icon: <ArrowRightLeft className="h-6 w-6 text-blue-500" />,
    href: "/tools/image/convert/jpg-to-png",
  },
  {
    title: "PNG to JPG",
    description: "Compress and convert your PNG images to standard JPG format.",
    icon: <ArrowRightLeft className="h-6 w-6 text-blue-500" />,
    href: "/tools/image/convert/png-to-jpg",
  },
  {
    title: "WEBP to JPG",
    description: "Convert modern WebP images to widely supported JPG format.",
    icon: <ArrowRightLeft className="h-6 w-6 text-blue-500" />,
    href: "/tools/image/convert/webp-to-jpg",
  },
  {
    title: "WEBP to PNG",
    description: "Convert modern WebP images to high-quality PNG format.",
    icon: <ArrowRightLeft className="h-6 w-6 text-blue-500" />,
    href: "/tools/image/convert/webp-to-png",
  },
  {
    title: "Image Compressor",
    description: "Compress images to reduce file size without losing quality.",
    icon: <Minimize2 className="h-6 w-6 text-blue-500" />,
    href: "/tools/image/compress",
  },
];

export default function ImageToolsPage() {
  return (
    <div className="w-full min-h-screen grid-pattern relative">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-background to-transparent pointer-events-none -z-10"></div>
      
      <div className="container mx-auto py-16 px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mb-16 text-center mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-3xl mb-8 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]">
            <Image className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 text-glow">
            Image Tools
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto text-balance">
            Powerful, fast, and free online utilities to convert, compress, and edit your images.
          </p>
        </div>
        
        <ImageToolsClient tools={tools} />
      </div>
    </div>
  );
}
