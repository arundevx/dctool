"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { GlobalSearch } from "@/components/layout/global-search";
import { buttonVariants } from "@/components/ui/button";
import { MonitorSmartphone, Menu, UserCircle } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-4 z-50 w-[95%] md:w-full max-w-7xl mx-auto border border-white/10 dark:border-white/5 bg-white/5 dark:bg-black/20 backdrop-blur-2xl shadow-xl rounded-full">
      <div className="container flex h-16 items-center px-6 md:px-8 mx-auto">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 group">
            <Image 
              src="/logo.png" 
              alt="DreamConsole Logo" 
              width={32} 
              height={32} 
              className="rounded-lg group-hover:scale-110 transition-transform duration-300" 
            />
            <span className="font-bold sm:inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-fuchsia-600 dark:from-indigo-400 dark:to-fuchsia-400">
              DreamConsole
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/tools/image" className={`transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${pathname?.startsWith("/tools/image") ? "text-indigo-600 dark:text-indigo-400 font-semibold" : "text-foreground/70"}`}>Image Tools</Link>
            <Link href="/tools/pdf" className={`transition-colors hover:text-rose-600 dark:hover:text-rose-400 ${pathname?.startsWith("/tools/pdf") ? "text-rose-600 dark:text-rose-400 font-semibold" : "text-foreground/70"}`}>PDF Tools</Link>
            <Link href="/tools/developer" className={`transition-colors hover:text-violet-600 dark:hover:text-violet-400 ${pathname?.startsWith("/tools/developer") ? "text-violet-600 dark:text-violet-400 font-semibold" : "text-foreground/70"}`}>Developer</Link>
            <Link href="/tools/downloader" className={`transition-colors hover:text-purple-600 dark:hover:text-purple-400 ${pathname?.startsWith("/tools/downloader") ? "text-purple-600 dark:text-purple-400 font-semibold" : "text-foreground/70"}`}>Downloader</Link>
            <Link href="/tools/seo" className={`transition-colors hover:text-amber-600 dark:hover:text-amber-400 ${pathname?.startsWith("/tools/seo") ? "text-amber-600 dark:text-amber-400 font-semibold" : "text-foreground/70"}`}>SEO</Link>
            <Link href="/faq" className={`transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${pathname?.startsWith("/faq") ? "text-indigo-600 dark:text-indigo-400 font-semibold" : "text-foreground/70"}`}>FAQ</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none flex justify-end md:justify-center md:mx-4">
            <GlobalSearch />
          </div>
          <nav className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 outline-none group hidden md:flex">
                    <div className="bg-indigo-500/10 p-1.5 rounded-full group-hover:bg-indigo-500/20 transition-colors">
                      <UserCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-sm font-medium hidden lg:block">{user?.email?.split('@')[0]}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer w-full flex items-center">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer w-full flex items-center">
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/auth" className="text-sm font-medium bg-indigo-600 text-white px-4 py-1.5 rounded-full hover:bg-indigo-700 transition-colors hidden md:block">
                Sign In
              </Link>
            )}
            <ThemeToggle />
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon" }) + " md:hidden"}>
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-indigo-500/20">
                  <div className="flex flex-col space-y-2 mt-8">
                    <Link href="/tools/image" className={`text-base font-medium p-3 rounded-xl transition-colors hover:bg-indigo-500/10 hover:text-indigo-600 ${pathname?.startsWith("/tools/image") ? "bg-indigo-500/10 text-indigo-600" : "text-foreground/70"}`}>Image Tools</Link>
                    <Link href="/tools/pdf" className={`text-base font-medium p-3 rounded-xl transition-colors hover:bg-rose-500/10 hover:text-rose-600 ${pathname?.startsWith("/tools/pdf") ? "bg-rose-500/10 text-rose-600" : "text-foreground/70"}`}>PDF Tools</Link>
                    <Link href="/tools/developer" className={`text-base font-medium p-3 rounded-xl transition-colors hover:bg-violet-500/10 hover:text-violet-600 ${pathname?.startsWith("/tools/developer") ? "bg-violet-500/10 text-violet-600" : "text-foreground/70"}`}>Developer Tools</Link>
                    <Link href="/tools/downloader" className={`text-base font-medium p-3 rounded-xl transition-colors hover:bg-purple-500/10 hover:text-purple-600 ${pathname?.startsWith("/tools/downloader") ? "bg-purple-500/10 text-purple-600" : "text-foreground/70"}`}>Downloader</Link>
                    <Link href="/tools/seo" className={`text-base font-medium p-3 rounded-xl transition-colors hover:bg-amber-500/10 hover:text-amber-600 ${pathname?.startsWith("/tools/seo") ? "bg-amber-500/10 text-amber-600" : "text-foreground/70"}`}>SEO Tools</Link>
                    <Link href="/faq" className={`text-base font-medium p-3 rounded-xl transition-colors hover:bg-indigo-500/10 hover:text-indigo-600 ${pathname?.startsWith("/faq") ? "bg-indigo-500/10 text-indigo-600" : "text-foreground/70"}`}>FAQ</Link>
                    
                    <div className="my-4 border-t border-white/10 dark:border-white/5 pt-4 flex flex-col space-y-2">
                      {isAuthenticated ? (
                        <>
                          {user?.role === "admin" && (
                            <Link href="/admin" className="text-base font-medium p-3 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-600 transition-colors">Admin Dashboard</Link>
                          )}
                          <Link href="/profile" className="text-base font-medium p-3 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-600 transition-colors">Profile</Link>
                          <button onClick={handleLogout} className="text-left text-base font-medium p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors">Log out</button>
                        </>
                      ) : (
                        <Link href="/auth" className="text-base font-medium p-3 bg-indigo-600 text-white rounded-xl text-center hover:bg-indigo-700 transition-colors">Sign In</Link>
                      )}
                    </div>
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
