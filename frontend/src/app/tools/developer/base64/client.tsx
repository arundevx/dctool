"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ArrowRightLeft, Check } from "lucide-react";

export default function Base64Client() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const processText = (text: string, currentMode: "encode" | "decode") => {
    try {
      if (!text) {
        setOutput("");
        setError(null);
        return;
      }
      if (currentMode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(text))));
      } else {
        setOutput(decodeURIComponent(escape(atob(text))));
      }
      setError(null);
    } catch (e: any) {
      setError("Invalid input for " + currentMode);
      setOutput("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInput(text);
    processText(text, mode);
  };

  const toggleMode = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    setInput(output);
    processText(output, newMode);
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
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Base64 {mode === "encode" ? "Encoder" : "Decoder"}</h1>
          <p className="text-muted-foreground">Instantly {mode} text to and from Base64 format.</p>
        </div>
        <Button variant="outline" onClick={toggleMode} className="gap-2 shrink-0">
          <ArrowRightLeft className="h-4 w-4" /> 
          Switch to {mode === "encode" ? "Decode" : "Encode"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold">Input {mode === "encode" ? "Text" : "Base64"}</h2>
          <textarea
            className="w-full h-[400px] p-4 font-mono text-sm border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none resize-none"
            placeholder={`Paste your ${mode === "encode" ? "text" : "Base64 string"} here...`}
            value={input}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Output {mode === "encode" ? "Base64" : "Text"}</h2>
            <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output && !error}>
              {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />} 
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <textarea
            className={`w-full h-[400px] p-4 font-mono text-sm border rounded-lg bg-muted/30 focus:ring-2 focus:ring-primary outline-none resize-none ${error ? 'border-destructive text-destructive' : ''}`}
            readOnly
            value={error ? error : output}
          />
        </div>
      </div>
    </div>
  );
}
