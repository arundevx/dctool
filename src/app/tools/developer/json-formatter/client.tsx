"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Minimize, AlignLeft, Check } from "lucide-react";

export default function JsonFormatterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e: any) {
      setError(e.message || "Invalid JSON");
    }
  };

  const handleMinify = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e: any) {
      setError(e.message || "Invalid JSON");
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">JSON Formatter & Validator</h1>
        <p className="text-muted-foreground">Format, validate, and minify your JSON data instantly in the browser.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Input JSON</h2>
            <Button variant="ghost" size="sm" onClick={() => setInput("")}>
              <RefreshCw className="h-4 w-4 mr-2" /> Clear
            </Button>
          </div>
          <textarea
            className="w-full h-[500px] p-4 font-mono text-sm border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none resize-none"
            placeholder="Paste your JSON here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Output</h2>
            <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output}>
              {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />} 
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <div className="relative">
            <textarea
              className={`w-full h-[500px] p-4 font-mono text-sm border rounded-lg bg-muted/30 focus:ring-2 focus:ring-primary outline-none resize-none ${error ? 'border-destructive' : ''}`}
              readOnly
              value={error ? `Error:\n${error}` : output}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-12 relative z-10">
        <Button onClick={handleFormat} size="lg" className="h-16 px-12 text-xl rounded-full bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500 text-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] transition-all hover:scale-105 border-0 gap-3 w-full sm:w-auto">
          <AlignLeft className="h-6 w-6" /> Format JSON
        </Button>
        <Button onClick={handleMinify} variant="secondary" size="lg" className="h-16 px-12 text-xl rounded-full glass-button transition-all hover:scale-105 gap-3 w-full sm:w-auto">
          <Minimize className="h-6 w-6" /> Minify JSON
        </Button>
      </div>
    </div>
  );
}
