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

export default function ImageToolsClient({ tools }: { tools: Tool[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = tools.filter((tool) =>
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto mb-10 relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search image tools..."
          className="pl-12 py-6 text-lg rounded-2xl glass-panel border-white/10 focus-visible:ring-indigo-500 bg-background/40 w-full shadow-[0_0_30px_-15px_rgba(99,102,241,0.3)]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto relative z-10">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group">
              <Card className="glass-panel hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="flex flex-row items-center gap-6 relative z-10 p-6">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-all duration-500 shadow-sm shrink-0">
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2 group-hover:text-indigo-400 transition-colors">{tool.title}</CardTitle>
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
