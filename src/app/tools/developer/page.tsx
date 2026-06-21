import Link from "next/link";
import { Code, Fingerprint, Hash, Clock, FileJson } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { ToolList } from "@/components/ui/tool-list";

export const metadata = constructMetadata({
  title: "Developer Tools",
  description: "Free online developer tools including JSON formatters, UUID generators, Base64 encoding, and more.",
  path: "/tools/developer",
});

const tools = [
  {
    title: "JSON Formatter",
    description: "Format, validate, and minify JSON data instantly.",
    icon: <FileJson className="h-6 w-6 text-purple-500" />,
    href: "/tools/developer/json-formatter",
  },
  {
    title: "UUID Generator",
    description: "Generate v4 universally unique identifiers (UUIDs).",
    icon: <Fingerprint className="h-6 w-6 text-purple-500" />,
    href: "/tools/developer/uuid-generator",
  },
  {
    title: "Base64 Encode/Decode",
    description: "Encode or decode strings using Base64 format.",
    icon: <Hash className="h-6 w-6 text-purple-500" />,
    href: "/tools/developer/base64",
  },
  {
    title: "Timestamp Converter",
    description: "Convert Unix timestamps to human-readable dates and vice-versa.",
    icon: <Clock className="h-6 w-6 text-purple-500" />,
    href: "/tools/developer/timestamp-converter",
  },
];

export default function DeveloperToolsPage() {
  return (
    <div className="w-full min-h-screen grid-pattern relative">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-500/10 via-background to-transparent pointer-events-none -z-10"></div>
      
      <div className="container mx-auto py-16 px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mb-16 text-center mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-4 bg-violet-500/10 border border-violet-500/20 rounded-3xl mb-8 shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)]">
            <Code className="h-12 w-12 text-violet-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-600 text-glow">
            Developer Tools
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto text-balance">
            Essential utilities for software developers. Fast, secure, and running entirely in your browser.
          </p>
        </div>
        
        <ToolList tools={tools} colorTheme="violet" />
      </div>
    </div>
  );
}
