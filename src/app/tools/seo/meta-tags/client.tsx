"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Tags, Check } from "lucide-react";

export default function MetaTagsClient() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keywords: "",
    author: "",
    imageUrl: "",
    url: "",
  });

  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    return `<!-- Primary Meta Tags -->
<title>${formData.title || "Page Title"}</title>
<meta name="title" content="${formData.title}" />
<meta name="description" content="${formData.description}" />
<meta name="keywords" content="${formData.keywords}" />
<meta name="author" content="${formData.author}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${formData.url}" />
<meta property="og:title" content="${formData.title}" />
<meta property="og:description" content="${formData.description}" />
<meta property="og:image" content="${formData.imageUrl}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${formData.url}" />
<meta property="twitter:title" content="${formData.title}" />
<meta property="twitter:description" content="${formData.description}" />
<meta property="twitter:image" content="${formData.imageUrl}" />`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Tags className="h-8 w-8 text-orange-500" />
          Meta Tag Generator
        </h1>
        <p className="text-muted-foreground">Generate optimized HTML meta tags, OpenGraph, and Twitter cards for your website.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Site Title</label>
            <Input name="title" placeholder="e.g. DreamConsole - Free SEO Tools" value={formData.title} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Site Description</label>
            <textarea
              name="description"
              className="w-full h-24 p-3 border rounded-md bg-background focus:ring-2 focus:ring-primary outline-none resize-none text-sm"
              placeholder="e.g. Enhance your workflow with our suite of tools..."
              value={formData.description}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground text-right">{formData.description.length} / 160 recommended chars</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Keywords (Comma separated)</label>
            <Input name="keywords" placeholder="e.g. tools, developer, seo, free" value={formData.keywords} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Author</label>
            <Input name="author" placeholder="e.g. John Doe" value={formData.author} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Canonical URL</label>
            <Input name="url" placeholder="e.g. https://dreamconsole.org" value={formData.url} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL (For Social Sharing)</label>
            <Input name="imageUrl" placeholder="e.g. https://dreamconsole.org/og.png" value={formData.imageUrl} onChange={handleInputChange} />
          </div>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Generated Meta Tags</h2>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />} 
              {copied ? "Copied!" : "Copy HTML"}
            </Button>
          </div>
          <textarea
            className="w-full h-[550px] p-4 font-mono text-sm border rounded-lg bg-muted/30 focus:ring-2 focus:ring-primary outline-none resize-none"
            readOnly
            value={generateCode()}
          />
        </div>
      </div>
    </div>
  );
}
