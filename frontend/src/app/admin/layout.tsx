"use client";

import { useAuthStore } from "@/lib/store/auth";
import { Shield, Users, Settings, Wrench, BarChart3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  const navItems = [
    { href: "/admin", label: "Users", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
    { href: "/admin/tools", label: "Tools", icon: Wrench },
    { href: "/admin/stats", label: "Stats", icon: BarChart3 },
  ];

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <div className="flex items-center space-x-3 mb-8">
        <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
                    isActive 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25" 
                      : "hover:bg-white/10 text-foreground/70 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="bg-white/5 dark:bg-black/20 rounded-2xl border border-white/10 dark:border-white/5 p-6 md:p-8 backdrop-blur-xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
