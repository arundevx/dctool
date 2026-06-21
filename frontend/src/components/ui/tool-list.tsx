"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type Tool = {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
};

interface ToolListProps {
  tools: Tool[];
  colorTheme: "blue" | "rose" | "violet" | "amber" | "indigo";
}

export function ToolList({ tools, colorTheme }: ToolListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = tools.filter((tool) =>
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Map theme colors dynamically for Tailwind since dynamic class names need to be safelisted or explicitly written
  const colorMap = {
    blue: "bg-blue-500/20 border-blue-500/30 text-blue-400 group-hover:bg-blue-500/20 focus-visible:ring-blue-500 shadow-blue-500/30",
    rose: "bg-rose-500/20 border-rose-500/30 text-rose-400 group-hover:bg-rose-500/20 focus-visible:ring-rose-500 shadow-rose-500/30",
    violet: "bg-violet-500/20 border-violet-500/30 text-violet-400 group-hover:bg-violet-500/20 focus-visible:ring-violet-500 shadow-violet-500/30",
    amber: "bg-amber-500/20 border-amber-500/30 text-amber-400 group-hover:bg-amber-500/20 focus-visible:ring-amber-500 shadow-amber-500/30",
    indigo: "bg-indigo-500/20 border-indigo-500/30 text-indigo-400 group-hover:bg-indigo-500/20 focus-visible:ring-indigo-500 shadow-indigo-500/30",
  };

  const gradientMap = {
    blue: "from-blue-500/5",
    rose: "from-rose-500/5",
    violet: "from-violet-500/5",
    amber: "from-amber-500/5",
    indigo: "from-indigo-500/5",
  };

  const ringClass = colorMap[colorTheme].split(" ").find(c => c.startsWith("focus-visible:ring-"));
  const shadowClass = colorMap[colorTheme].split(" ").find(c => c.startsWith("shadow-"));
  const hoverBgClass = colorMap[colorTheme].split(" ").find(c => c.startsWith("group-hover:bg-"));
  const hoverBorderClass = colorMap[colorTheme].split(" ").find(c => c.startsWith("border-")); // Will map correctly below
  
  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto mb-10 relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search tools..."
          className={`pl-12 py-6 text-lg rounded-2xl glass-panel border-white/10 ${ringClass} bg-background/40 w-full shadow-[0_0_30px_-15px_rgba(var(--color-${colorTheme}-500),0.3)]`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto relative z-10">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group">
              <Card className="glass-panel hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${gradientMap[colorTheme]} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <CardHeader className="flex flex-row items-center gap-6 relative z-10 p-6">
                  <div className={`bg-white/5 border border-white/10 p-4 rounded-2xl group-hover:scale-110 ${hoverBgClass} transition-all duration-500 shadow-sm shrink-0`}>
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className={`text-2xl mb-2 transition-colors`}>{tool.title}</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground/80 leading-relaxed">{tool.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 glass-panel rounded-3xl">
            <p className="text-xl text-muted-foreground">No tools found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
