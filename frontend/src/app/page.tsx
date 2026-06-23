import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PopularTools } from "@/components/layout/popular-tools";
import { HomeCategories } from "@/components/layout/home-categories";
import { HomeHeroSearch } from "@/components/layout/home-hero-search";
import { ArrowRight, MonitorSmartphone, ShieldCheck, Zap } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { ALL_TOOLS } from "@/lib/tools";
import { WebSite } from "schema-dts";

export const metadata = constructMetadata({
  title: "Free Online Tools - Image, PDF, Developer & SEO",
  description:
    "DreamConsole offers a comprehensive suite of free, fast, and secure online tools. Convert images, merge PDFs, format JSON, generate SEO tags, and much more.",
  path: "/",
});

const TOOL_COUNT = ALL_TOOLS.length;

export default function HomePage() {
  const websiteSchema: WebSite = {
    "@type": "WebSite",
    name: "DreamConsole",
    url: "https://dreamconsole.org",
    description:
      "Free online tools for images, PDFs, developers, and SEO — compress, convert, merge, format, and more.",
  };

  return (
    <>
      <JsonLd<WebSite> schema={{ "@context": "https://schema.org", ...websiteSchema }} />
      <div className="flex flex-col items-center w-full min-h-screen bg-background grid-pattern relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-background to-transparent pointer-events-none -z-10" />

        {/* Hero */}
        <section className="w-full relative py-16 md:py-24 flex flex-col items-center px-4 overflow-hidden mt-8 md:mt-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-fuchsia-500/10 blur-[120px] -z-10 rounded-full pointer-events-none" />

          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4 animate-in fade-in duration-700">
            {TOOL_COUNT}+ free tools · No signup required
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight max-w-5xl text-center text-balance mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Every tool you need, in one{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500 text-glow">
              Console
            </span>
            .
          </h1>

          <p className="text-lg md:text-2xl text-muted-foreground/80 max-w-3xl text-center text-balance mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
            Convert images, manage PDFs, format code, and optimize SEO content — fast, secure, and completely free.
          </p>

          <HomeHeroSearch />

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
            <Link
              href="/tools/image"
              className={buttonVariants({
                size: "lg",
                className:
                  "h-14 px-10 text-lg rounded-full w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.6)] transition-all hover:scale-105 border-0",
              })}
            >
              Browse Image Tools <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/faq"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className: "h-14 px-10 text-lg rounded-full w-full sm:w-auto glass-button transition-all hover:scale-105",
              })}
            >
              FAQ
            </Link>
          </div>
        </section>

        <PopularTools />

        <HomeCategories />

        {/* SEO intro */}
        <section className="w-full py-12 px-4 md:px-8 container mx-auto max-w-3xl text-center relative z-10">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Your all-in-one online toolkit</h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            DreamConsole brings together professional-grade utilities for everyday tasks. Students, marketers,
            developers, and small businesses use our tools to compress images, merge PDFs, format JSON, generate meta
            tags, remove backgrounds, and much more. Most file-processing tools delete your uploads automatically after
            download — see our{" "}
            <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Privacy Policy
            </Link>{" "}
            for details.
          </p>
        </section>

        {/* Why choose us */}
        <section className="w-full py-16 px-4 md:px-8 mb-16 relative overflow-hidden">
          <div className="container mx-auto relative z-10 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why use DreamConsole?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Experience the fastest, most secure way to process your files online.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 dark:bg-black/20 border border-white/10 dark:border-white/5 p-8 rounded-3xl text-center flex flex-col items-center group transition-all hover:-translate-y-1 shadow-lg backdrop-blur-md">
                <div className="bg-indigo-500/10 p-4 rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
                  <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-bold text-xl mb-3">100% Secure</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  All files are processed securely and deleted automatically. We never store your sensitive data permanently.
                </p>
              </div>

              <div className="bg-white/5 dark:bg-black/20 border border-white/10 dark:border-white/5 p-8 rounded-3xl text-center flex flex-col items-center group transition-all hover:-translate-y-1 shadow-lg backdrop-blur-md">
                <div className="bg-fuchsia-500/10 p-4 rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-fuchsia-500/20 transition-all duration-300">
                  <Zap className="w-8 h-8 text-fuchsia-600 dark:text-fuchsia-400" />
                </div>
                <h3 className="font-bold text-xl mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Tools run directly in your browser or on highly optimized servers to give you instant results, every time.
                </p>
              </div>

              <div className="bg-white/5 dark:bg-black/20 border border-white/10 dark:border-white/5 p-8 rounded-3xl text-center flex flex-col items-center group transition-all hover:-translate-y-1 shadow-lg backdrop-blur-md">
                <div className="bg-blue-500/10 p-4 rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                  <MonitorSmartphone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-xl mb-3">Mobile Optimized</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Whether you are on a desktop or your smartphone, our interface adapts perfectly to give you the best experience.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
