"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw, Check } from "lucide-react";

export default function UuidGeneratorClient() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState<number>(5);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateUUID = () => {
    // Basic v4 UUID generator using Web Crypto API
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
      (
        Number(c) ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
      ).toString(16)
    );
  };

  const handleGenerate = () => {
    const newUuids = Array.from({ length: Math.min(Math.max(count, 1), 100) }, generateUUID);
    setUuids(newUuids);
  };

  const handleCopy = (uuid: string, index: number) => {
    navigator.clipboard.writeText(uuid);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
  };

  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto py-12 px-4 md:px-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">UUID Generator</h1>
        <p className="text-muted-foreground">Generate random Version 4 UUIDs instantly in your browser.</p>
      </div>

      <div className="bg-muted/30 p-6 rounded-lg border mb-8 flex flex-col md:flex-row items-end md:items-center gap-4">
        <div className="flex-1 w-full space-y-2">
          <label className="text-sm font-medium">How many UUIDs?</label>
          <Input 
            type="number" 
            min={1} 
            max={100} 
            value={count} 
            onChange={(e) => setCount(Number(e.target.value))} 
            className="w-full md:max-w-[200px]"
          />
        </div>
        <Button onClick={handleGenerate} className="gap-2 w-full md:w-auto">
          <RefreshCw className="h-4 w-4" /> Generate
        </Button>
      </div>

      {uuids.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Generated UUIDs</h2>
            <Button variant="outline" size="sm" onClick={handleCopyAll}>
              <Copy className="h-4 w-4 mr-2" /> Copy All
            </Button>
          </div>
          <div className="border rounded-lg overflow-hidden bg-background">
            {uuids.map((uuid, index) => (
              <div 
                key={`${uuid}-${index}`} 
                className={`flex items-center justify-between p-3 ${index !== uuids.length - 1 ? 'border-b' : ''} hover:bg-muted/50 transition-colors`}
              >
                <code className="font-mono text-sm">{uuid}</code>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleCopy(uuid, index)}
                  className="h-8 w-8"
                >
                  {copiedIndex === index ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
