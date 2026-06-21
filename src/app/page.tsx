import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, FileText, Download, Code, Search, ArrowRight, MonitorSmartphone } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { WebSite } from "schema-dts";

export const metadata = constructMetadata({
  title: "Free Online Tools - Image, PDF, Developer & SEO",
  description: "DreamConsole offers a comprehensive suite of free, fast, and secure online tools. Convert images, merge PDFs, format JSON, generate SEO tags, and much more.",
  path: "/",
});

const categories = [
  {
    title: "Image Tools",
    description: "Compress, resize, crop, and convert images to various formats including WebP, PNG, and JPG.",
    icon: <Image className="h-8 w-8 text-indigo-500" />,
    href: "/tools/image",
  },
  {
    title: "PDF Tools",
    description: "Merge, split, compress, and manipulate PDF documents easily right in your browser.",
    icon: <FileText className="h-8 w-8 text-rose-500" />,
    href: "/tools/pdf",
  },
  {
    title: "Downloader Tools",
    description: "Extract logos, download favicons, capture website screenshots, and more.",
    icon: <Download className="h-8 w-8 text-emerald-500" />,
    href: "/tools/downloader",
  },
  {
    title: "Developer Tools",
    description: "Format JSON, encode/decode Base64, generate UUIDs, and convert timestamps.",
    icon: <Code className="h-8 w-8 text-violet-500" />,
    href: "/tools/developer",
  },
  {
    title: "SEO Tools",
    description: "Generate meta tags, sitemaps, robots.txt files to improve your website's search ranking.",
    icon: <Search className="h-8 w-8 text-amber-500" />,
    href: "/tools/seo",
  },
];

export default function HomePage() {
  const websiteSchema: WebSite = {
    "@type": "WebSite",
    name: "DreamConsole",
    url: "https://dreamconsole.org",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://dreamconsole.org/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    } as any,
  };

  return (
    <>
      <JsonLd<WebSite> schema={{ "@context": "https://schema.org", ...websiteSchema }} />
      <div className="flex flex-col items-center w-full min-h-screen bg-background grid-pattern relative">
        {/* Glow ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-background to-transparent pointer-events-none -z-10"></div>
        {/* Hero Section */}
        <section className="w-full relative py-20 md:py-28 flex flex-col items-center px-4 overflow-hidden mt-8 md:mt-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-fuchsia-500/10 blur-[120px] -z-10 rounded-full pointer-events-none"></div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight max-w-5xl text-center text-balance mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Every tool you need, in one <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500 text-glow">Console</span>.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-3xl text-center text-balance mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
            DreamConsole is a comprehensive, free suite of online tools. Enhance images, manage PDFs, speed up your development workflow, and boost your SEO effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
            <Link href="/tools/image" className={buttonVariants({ size: "lg", className: "h-16 px-10 text-lg rounded-full w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.6)] transition-all hover:scale-105 border-0" })}>
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/blog" className={buttonVariants({ size: "lg", variant: "outline", className: "h-16 px-10 text-lg rounded-full w-full sm:w-auto glass-button transition-all hover:scale-105" })}>
              Read our Blog
            </Link>
          </div>
        </section>

        {/* Categories Section - Bento Box */}
        <section className="w-full py-16 px-4 md:px-8 container mx-auto relative z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] -z-10 rounded-full pointer-events-none"></div>
          
          <div className="text-center mb-12 animate-in fade-in duration-1000">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Powerful Tools, Simple Interface</h2>
            <p className="text-muted-foreground/80 max-w-2xl mx-auto text-lg">Find exactly what you need from our extensive collection of specialized, blazing fast utilities.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 relative z-10">
            {categories.map((category, index) => {
              // Create an asymmetric bento box layout
              let spanClass = "md:col-span-3 lg:col-span-4"; 
              if (index === 0 || index === 3) spanClass = "md:col-span-6 lg:col-span-6"; // wider cards
              else if (index === 4) spanClass = "md:col-span-6 lg:col-span-8"; 

              return (
              <Card key={category.title} className={`glass-panel hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative ${spanClass}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05),transparent_50%)]"></div>
                
                <Link href={category.href} className="block relative z-10 h-full p-2">
                  <CardHeader>
                    <div className="mb-6 bg-white/5 border border-white/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-all duration-500 shadow-sm backdrop-blur-sm">
                      {category.icon}
                    </div>
                    <CardTitle className="text-2xl group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-fuchsia-400 transition-all">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base md:text-lg text-muted-foreground/80 leading-relaxed">{category.description}</CardDescription>
                  </CardContent>
                </Link>
              </Card>
            )})}
          </div>
        </section>

        {/* Features / Why choose us */}
        <section className="w-full py-20 px-4 md:px-8 mt-12 mb-20 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_0%_100%,rgba(217,70,239,0.05),transparent_50%)] pointer-events-none z-0"></div>
          <div className="container mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-10 tracking-tight text-glow">Why use DreamConsole?</h2>
                <ul className="space-y-8">
                  <li className="flex gap-6 group">
                    <div className="bg-white/5 border border-white/10 p-2 rounded-2xl h-14 w-14 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 transition-all duration-500 shadow-lg">
                      <span className="text-indigo-400 font-bold text-xl group-hover:text-glow">1</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-2xl mb-2 text-foreground/90">100% Free & Secure</h4>
                      <p className="text-muted-foreground/80 text-lg leading-relaxed">All files are processed securely and deleted automatically. We don't store your sensitive data.</p>
                    </div>
                  </li>
                  <li className="flex gap-6 group">
                    <div className="bg-white/5 border border-white/10 p-2 rounded-2xl h-14 w-14 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-fuchsia-500/20 group-hover:border-fuchsia-500/40 transition-all duration-500 shadow-lg">
                      <span className="text-fuchsia-400 font-bold text-xl group-hover:text-glow">2</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-2xl mb-2 text-foreground/90">Lightning Fast</h4>
                      <p className="text-muted-foreground/80 text-lg leading-relaxed">Powered by modern web technologies, our tools run right in your browser or on blazing-fast edge servers.</p>
                    </div>
                  </li>
                  <li className="flex gap-6 group">
                    <div className="bg-white/5 border border-white/10 p-2 rounded-2xl h-14 w-14 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:border-blue-500/40 transition-all duration-500 shadow-lg">
                      <span className="text-blue-400 font-bold text-xl group-hover:text-glow">3</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-2xl mb-2 text-foreground/90">No Registration Required</h4>
                      <p className="text-muted-foreground/80 text-lg leading-relaxed">Jump straight in and use our tools without the hassle of creating an account or signing in.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="glass-panel rounded-3xl p-10 flex items-center justify-center aspect-square md:aspect-video lg:aspect-square relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-fuchsia-500/5 to-transparent z-0 group-hover:scale-110 transition-transform duration-1000" />
                <div className="z-10 text-center relative flex flex-col items-center">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-full shadow-[0_0_50px_-10px_rgba(99,102,241,0.3)] mb-8 group-hover:shadow-[0_0_80px_-10px_rgba(99,102,241,0.5)] transition-shadow duration-700">
                    <MonitorSmartphone className="h-24 w-24 text-indigo-400 group-hover:text-fuchsia-400 transition-colors duration-700 animate-pulse" />
                  </div>
                  <p className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-fuchsia-400 text-glow">Mobile First Experience</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
