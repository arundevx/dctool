import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PopularTools } from "@/components/layout/popular-tools";
import { HomeCategories } from "@/components/layout/home-categories";
import { HomeHeroSearch } from "@/components/layout/home-hero-search";
import { ArrowRight, MonitorSmartphone } from "lucide-react";
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
        <section className="w-full py-20 px-4 md:px-8 mb-20 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_0%_100%,rgba(217,70,239,0.05),transparent_50%)] pointer-events-none z-0" />
          <div className="container mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-10 tracking-tight text-glow">
                  Why use DreamConsole?
                </h2>
                <ul className="space-y-8">
                  <li className="flex gap-6 group">
                    <div className="bg-white/5 border border-white/10 p-2 rounded-2xl h-14 w-14 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 transition-all duration-500 shadow-lg">
                      <span className="text-indigo-400 font-bold text-xl">1</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl mb-2 text-foreground/90">100% Free & Secure</h3>
                      <p className="text-muted-foreground/80 text-lg leading-relaxed">
                        All files are processed securely and deleted automatically. We don&apos;t store your sensitive
                        data.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-6 group">
                    <div className="bg-white/5 border border-white/10 p-2 rounded-2xl h-14 w-14 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-fuchsia-500/20 group-hover:border-fuchsia-500/40 transition-all duration-500 shadow-lg">
                      <span className="text-fuchsia-400 font-bold text-xl">2</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl mb-2 text-foreground/90">Lightning Fast</h3>
                      <p className="text-muted-foreground/80 text-lg leading-relaxed">
                        Tools run in your browser or on fast servers so you get results in seconds, not minutes.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-6 group">
                    <div className="bg-white/5 border border-white/10 p-2 rounded-2xl h-14 w-14 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:border-blue-500/40 transition-all duration-500 shadow-lg">
                      <span className="text-blue-400 font-bold text-xl">3</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl mb-2 text-foreground/90">No Registration Required</h3>
                      <p className="text-muted-foreground/80 text-lg leading-relaxed">
                        Jump straight in — no account, no email, no credit card.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="glass-panel rounded-3xl p-10 flex items-center justify-center aspect-square md:aspect-video lg:aspect-square relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-fuchsia-500/5 to-transparent z-0 group-hover:scale-110 transition-transform duration-1000" />
                <div className="z-10 text-center relative flex flex-col items-center">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-full shadow-[0_0_50px_-10px_rgba(99,102,241,0.3)] mb-8 group-hover:shadow-[0_0_80px_-10px_rgba(99,102,241,0.5)] transition-shadow duration-700">
                    <MonitorSmartphone className="h-24 w-24 text-indigo-400 group-hover:text-fuchsia-400 transition-colors duration-700" />
                  </div>
                  <p className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-fuchsia-400 text-glow">
                    Mobile First Experience
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
