import Link from "next/link";
import { MonitorSmartphone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 dark:border-white/5 bg-background/40 backdrop-blur-2xl relative overflow-hidden mt-auto">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 blur-[100px] -z-10 rounded-full pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-indigo-500/10 p-1.5 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                <MonitorSmartphone className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-fuchsia-600 dark:from-indigo-400 dark:to-fuchsia-400">DreamConsole</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A comprehensive suite of free, fast, and secure online tools for developers, SEO professionals, and everyday users.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm tracking-wider uppercase text-foreground/80">Tools</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/tools/image" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Image Tools</Link></li>
              <li><Link href="/tools/pdf" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">PDF Tools</Link></li>
              <li><Link href="/tools/developer" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Developer Tools</Link></li>
              <li><Link href="/tools/downloader" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Video Downloader</Link></li>
              <li><Link href="/tools/seo" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">SEO Tools</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm tracking-wider uppercase text-foreground/80">Resources</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQ</Link></li>
              <li><Link href="/sitemap.xml" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sitemap</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm tracking-wider uppercase text-foreground/80">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-muted/50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DreamConsole. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {/* Social Links could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
