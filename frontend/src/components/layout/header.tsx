import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { GlobalSearch } from "@/components/layout/global-search";
import { buttonVariants } from "@/components/ui/button";
import { MonitorSmartphone, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="sticky top-4 z-50 w-[95%] md:w-full max-w-7xl mx-auto border border-white/10 dark:border-white/5 bg-white/5 dark:bg-black/20 backdrop-blur-2xl shadow-xl rounded-full">
      <div className="container flex h-16 items-center px-6 md:px-8 mx-auto">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 group">
            <div className="bg-indigo-500/10 p-1.5 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
              <MonitorSmartphone className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="font-bold sm:inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-fuchsia-600 dark:from-indigo-400 dark:to-fuchsia-400">
              DreamConsole
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/tools/image" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 text-foreground/70">Image Tools</Link>
            <Link href="/tools/pdf" className="transition-colors hover:text-rose-600 dark:hover:text-rose-400 text-foreground/70">PDF Tools</Link>
            <Link href="/tools/developer" className="transition-colors hover:text-violet-600 dark:hover:text-violet-400 text-foreground/70">Developer</Link>
            <Link href="/tools/downloader" className="transition-colors hover:text-purple-600 dark:hover:text-purple-400 text-foreground/70">Downloader</Link>
            <Link href="/tools/seo" className="transition-colors hover:text-amber-600 dark:hover:text-amber-400 text-foreground/70">SEO</Link>
            <Link href="/faq" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 text-foreground/70">FAQ</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none flex justify-end md:justify-center md:mx-4">
            <GlobalSearch />
          </div>
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon" }) + " md:hidden"}>
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-indigo-500/20">
                  <div className="flex flex-col space-y-2 mt-8">
                    <Link href="/tools/image" className="text-base font-medium p-3 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-600 transition-colors">Image Tools</Link>
                    <Link href="/tools/pdf" className="text-base font-medium p-3 rounded-xl hover:bg-rose-500/10 hover:text-rose-600 transition-colors">PDF Tools</Link>
                    <Link href="/tools/developer" className="text-base font-medium p-3 rounded-xl hover:bg-violet-500/10 hover:text-violet-600 transition-colors">Developer Tools</Link>
                    <Link href="/tools/downloader" className="text-base font-medium p-3 rounded-xl hover:bg-purple-500/10 hover:text-purple-600 transition-colors">Downloader</Link>
                    <Link href="/tools/seo" className="text-base font-medium p-3 rounded-xl hover:bg-amber-500/10 hover:text-amber-600 transition-colors">SEO Tools</Link>
                    <Link href="/faq" className="text-base font-medium p-3 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-600 transition-colors">FAQ</Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
