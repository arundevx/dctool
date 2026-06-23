export type ToolCategory = "image" | "pdf" | "developer" | "seo" | "downloader";

export type ToolColorTheme = "blue" | "rose" | "violet" | "amber" | "fuchsia" | "indigo";

export interface Tool {
  title: string;
  description: string;
  href: string;
  category: ToolCategory;
  categoryLabel: string;
  categoryHref: string;
  colorTheme: ToolColorTheme;
  popular?: boolean;
  keywords?: string[];
}

export const CATEGORY_META: Record<
  ToolCategory,
  { label: string; href: string; colorTheme: ToolColorTheme }
> = {
  image: { label: "Image Tools", href: "/tools/image", colorTheme: "blue" },
  pdf: { label: "PDF Tools", href: "/tools/pdf", colorTheme: "rose" },
  developer: { label: "Developer Tools", href: "/tools/developer", colorTheme: "violet" },
  seo: { label: "SEO Tools", href: "/tools/seo", colorTheme: "amber" },
  downloader: { label: "Downloader", href: "/tools/downloader", colorTheme: "indigo" },
};

function tool(
  partial: Omit<Tool, "categoryLabel" | "categoryHref" | "colorTheme"> & {
    category: ToolCategory;
    colorTheme?: ToolColorTheme;
  }
): Tool {
  const meta = CATEGORY_META[partial.category];
  return {
    ...partial,
    categoryLabel: meta.label,
    categoryHref: meta.href,
    colorTheme: partial.colorTheme ?? meta.colorTheme,
  };
}

export const ALL_TOOLS: Tool[] = [
  tool({
    title: "AI Background Remover",
    description: "Instantly erase backgrounds from any image using advanced AI.",
    href: "/tools/image/remove-bg",
    category: "image",
    colorTheme: "fuchsia",
    popular: true,
    keywords: ["remove background", "transparent", "png"],
  }),
  tool({
    title: "JPG to PNG",
    description: "Convert JPG images to high-quality PNG format.",
    href: "/tools/image/convert/jpg-to-png",
    category: "image",
    popular: true,
    keywords: ["jpeg", "convert", "jpg"],
  }),
  tool({
    title: "PNG to JPG",
    description: "Convert PNG images to standard JPG format.",
    href: "/tools/image/convert/png-to-jpg",
    category: "image",
    keywords: ["jpeg", "convert"],
  }),
  tool({
    title: "WEBP to JPG",
    description: "Convert WebP images to widely supported JPG format.",
    href: "/tools/image/convert/webp-to-jpg",
    category: "image",
    keywords: ["convert", "webp"],
  }),
  tool({
    title: "WEBP to PNG",
    description: "Convert WebP images to high-quality PNG format.",
    href: "/tools/image/convert/webp-to-png",
    category: "image",
    keywords: ["convert", "webp"],
  }),
  tool({
    title: "HEIC to JPG",
    description: "Convert iPhone HEIC photos to widely supported JPG format.",
    href: "/tools/image/convert/heic-to-jpg",
    category: "image",
    popular: true,
    keywords: ["heic", "iphone", "convert", "jpg"],
  }),
  tool({
    title: "HEIC to PNG",
    description: "Convert HEIC images to high-quality PNG format.",
    href: "/tools/image/convert/heic-to-png",
    category: "image",
    keywords: ["heic", "iphone", "convert", "png"],
  }),
  tool({
    title: "Image Compressor",
    description: "Compress images to reduce file size without losing quality.",
    href: "/tools/image/compress",
    category: "image",
    popular: true,
    keywords: ["compress", "optimize"],
  }),
  tool({
    title: "Resize Image",
    description: "Change image dimensions with optional aspect ratio lock.",
    href: "/tools/image/resize",
    category: "image",
    popular: true,
    keywords: ["scale", "dimensions", "width", "height"],
  }),
  tool({
    title: "Crop Image",
    description: "Trim images to an exact region using pixel coordinates.",
    href: "/tools/image/crop",
    category: "image",
    keywords: ["trim", "cut", "crop"],
  }),
  tool({
    title: "Add Watermark",
    description: "Protect images with a customizable text watermark.",
    href: "/tools/image/watermark",
    category: "image",
    keywords: ["text", "stamp", "copyright"],
  }),
  tool({
    title: "Rotate & Flip",
    description: "Rotate 90°, 180°, 270° or flip images horizontally and vertically.",
    href: "/tools/image/rotate-flip",
    category: "image",
    keywords: ["rotate", "flip", "mirror", "turn"],
  }),
  tool({
    title: "Image to PDF",
    description: "Convert a single image to a PDF file.",
    href: "/tools/image/to-pdf",
    category: "image",
    keywords: ["convert", "pdf"],
  }),
  tool({
    title: "Blur & Redact Region",
    description: "Blur or black out a region to hide faces or sensitive details.",
    href: "/tools/image/redact",
    category: "image",
    keywords: ["blur", "redact", "privacy", "face"],
  }),
  tool({
    title: "Merge PDF",
    description: "Combine multiple PDF files into one single document.",
    href: "/tools/pdf/merge",
    category: "pdf",
    popular: true,
    keywords: ["combine", "join"],
  }),
  tool({
    title: "Compress PDF",
    description: "Reduce the file size of your PDF documents.",
    href: "/tools/pdf/compress",
    category: "pdf",
    popular: true,
    keywords: ["shrink", "optimize"],
  }),
  tool({
    title: "Split PDF",
    description: "Extract pages or split every page into separate PDF files.",
    href: "/tools/pdf/split",
    category: "pdf",
    popular: true,
    keywords: ["extract", "pages", "divide"],
  }),
  tool({
    title: "PDF to Images",
    description: "Convert PDF pages to PNG or JPG images in a ZIP file.",
    href: "/tools/pdf/to-images",
    category: "pdf",
    keywords: ["png", "jpg", "convert"],
  }),
  tool({
    title: "PDF to Word",
    description: "Convert PDF documents to editable Word (.docx) files.",
    href: "/tools/pdf/to-word",
    category: "pdf",
    popular: true,
    keywords: ["docx", "word", "convert"],
  }),
  tool({
    title: "Word to PDF",
    description: "Convert Word (.docx) documents to PDF format.",
    href: "/tools/pdf/word-to-pdf",
    category: "pdf",
    keywords: ["docx", "convert"],
  }),
  tool({
    title: "PDF Watermark",
    description: "Add a text watermark to every page of your PDF.",
    href: "/tools/pdf/watermark",
    category: "pdf",
    keywords: ["stamp", "text", "copyright"],
  }),
  tool({
    title: "Rotate PDF",
    description: "Rotate all pages in a PDF by 90°, 180°, or 270°.",
    href: "/tools/pdf/rotate",
    category: "pdf",
    keywords: ["turn", "orientation", "angle"],
  }),
  tool({
    title: "Add Page Numbers",
    description: "Stamp page numbers on every page of your PDF document.",
    href: "/tools/pdf/page-numbers",
    category: "pdf",
    keywords: ["numbering", "pagination", "footer"],
  }),
  tool({
    title: "PDF to Text",
    description: "Extract plain text from PDF documents.",
    href: "/tools/pdf/to-text",
    category: "pdf",
    keywords: ["extract", "text", "txt", "ocr"],
  }),
  tool({
    title: "Reorder PDF Pages",
    description: "Drag and drop page thumbnails to rearrange your PDF.",
    href: "/tools/pdf/reorder",
    category: "pdf",
    keywords: ["reorder", "sort", "pages"],
  }),
  tool({
    title: "Sign PDF",
    description: "Add your signature image to a PDF document.",
    href: "/tools/pdf/sign",
    category: "pdf",
    keywords: ["signature", "sign", "e-sign"],
  }),
  tool({
    title: "Images to PDF",
    description: "Combine multiple images into one PDF document.",
    href: "/tools/pdf/images-to-pdf",
    category: "pdf",
    keywords: ["images", "combine", "convert"],
  }),
  tool({
    title: "Video Downloader",
    description: "Download videos and audio from hundreds of supported websites.",
    href: "/tools/downloader",
    category: "downloader",
    popular: true,
    keywords: ["youtube", "mp4", "mp3"],
  }),
  tool({
    title: "JSON Formatter",
    description: "Format, validate, and minify JSON data instantly.",
    href: "/tools/developer/json-formatter",
    category: "developer",
    popular: true,
    keywords: ["json", "prettify", "validate"],
  }),
  tool({
    title: "UUID Generator",
    description: "Generate v4 universally unique identifiers (UUIDs).",
    href: "/tools/developer/uuid-generator",
    category: "developer",
    keywords: ["guid", "unique id"],
  }),
  tool({
    title: "Base64 Encode/Decode",
    description: "Encode or decode strings using Base64 format.",
    href: "/tools/developer/base64",
    category: "developer",
    keywords: ["encode", "decode"],
  }),
  tool({
    title: "Timestamp Converter",
    description: "Convert Unix timestamps to human-readable dates and vice-versa.",
    href: "/tools/developer/timestamp-converter",
    category: "developer",
    keywords: ["unix", "epoch", "date"],
  }),
  tool({
    title: "URL Encode/Decode",
    description: "Encode or decode URLs and query strings instantly.",
    href: "/tools/developer/url-encode",
    category: "developer",
    keywords: ["percent", "encode", "decode", "uri"],
  }),
  tool({
    title: "Hash Generator",
    description: "Generate MD5 and SHA-256 hashes from any text.",
    href: "/tools/developer/hash-generator",
    category: "developer",
    keywords: ["md5", "sha256", "checksum", "hash"],
  }),
  tool({
    title: "HTML/CSS/JS Minifier",
    description: "Minify HTML, CSS, and JavaScript to reduce file size.",
    href: "/tools/developer/minifier",
    category: "developer",
    keywords: ["minify", "compress", "html", "css", "javascript"],
  }),
  tool({
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder Lorem Ipsum text for designs.",
    href: "/tools/developer/lorem-ipsum",
    category: "developer",
    keywords: ["placeholder", "dummy", "text"],
  }),
  tool({
    title: "Color Picker & Extractor",
    description: "Pick colors, convert HEX↔RGB, extract palettes from images or websites.",
    href: "/tools/developer/color-converter",
    category: "developer",
    keywords: ["hex", "rgb", "color", "picker", "palette", "extract"],
  }),
  tool({
    title: "JWT Decoder",
    description: "Decode JSON Web Tokens and inspect header and payload.",
    href: "/tools/developer/jwt-decoder",
    category: "developer",
    keywords: ["jwt", "token", "decode"],
  }),
  tool({
    title: "Regex Tester",
    description: "Test regular expressions against sample text in real time.",
    href: "/tools/developer/regex-tester",
    category: "developer",
    keywords: ["regex", "regexp", "pattern"],
  }),
  tool({
    title: "YAML Formatter",
    description: "Format, validate, and compact YAML documents.",
    href: "/tools/developer/yaml-formatter",
    category: "developer",
    keywords: ["yaml", "yml", "format"],
  }),
  tool({
    title: "Password Generator",
    description: "Generate secure random passwords with custom options.",
    href: "/tools/developer/password-generator",
    category: "developer",
    keywords: ["password", "secure", "random"],
  }),
  tool({
    title: "QR Code Generator",
    description: "Generate QR codes from text or URLs.",
    href: "/tools/developer/qr-code",
    category: "developer",
    keywords: ["qr", "qrcode", "barcode"],
  }),
  tool({
    title: "Meta Tag Generator",
    description: "Generate optimized HTML meta tags, OpenGraph, and Twitter cards.",
    href: "/tools/seo/meta-tags",
    category: "seo",
    popular: true,
    keywords: ["og", "open graph", "twitter card"],
  }),
  tool({
    title: "Sitemap Generator",
    description: "Easily generate an XML sitemap for your website structure.",
    href: "/tools/seo/sitemap",
    category: "seo",
    keywords: ["xml", "sitemap"],
  }),
  tool({
    title: "Robots.txt Generator",
    description: "Create a robots.txt file to control how search engines crawl your site.",
    href: "/tools/seo/robots",
    category: "seo",
    keywords: ["crawl", "robots"],
  }),
  tool({
    title: "Canonical URL Checker",
    description: "Normalize and compare URLs for canonical equivalence.",
    href: "/tools/seo/canonical-checker",
    category: "seo",
    keywords: ["canonical", "url", "duplicate", "seo"],
  }),
  tool({
    title: "Text Diff Checker",
    description: "Compare two texts and highlight added and removed lines.",
    href: "/tools/seo/text-diff",
    category: "seo",
    keywords: ["diff", "compare", "text"],
  }),
  tool({
    title: "Slug Generator",
    description: "Convert text into URL-friendly slugs.",
    href: "/tools/seo/slug-generator",
    category: "seo",
    keywords: ["url", "slug", "permalink"],
  }),
  tool({
    title: "Word & Character Counter",
    description: "Count words, characters, reading time, and keyword density.",
    href: "/tools/seo/word-counter",
    category: "seo",
    keywords: ["count", "words", "characters", "reading time", "keyword"],
  }),
  tool({
    title: "Remove Duplicate Lines",
    description: "Remove duplicate lines from text while preserving order.",
    href: "/tools/seo/remove-duplicate-lines",
    category: "seo",
    keywords: ["dedupe", "unique", "lines"],
  }),
  tool({
    title: "Open Graph Preview",
    description: "Preview how your page looks when shared on social media.",
    href: "/tools/seo/og-preview",
    category: "seo",
    keywords: ["og", "open graph", "social", "preview"],
  }),
  tool({
    title: "Meta Description Checker",
    description: "Check meta description length for optimal SEO (120–160 chars).",
    href: "/tools/seo/meta-description",
    category: "seo",
    keywords: ["meta", "description", "length", "seo"],
  }),
  tool({
    title: "Heading Structure Analyzer",
    description: "Analyze H1–H6 heading hierarchy from HTML.",
    href: "/tools/seo/heading-analyzer",
    category: "seo",
    keywords: ["h1", "headings", "html", "seo"],
  }),
  tool({
    title: "hreflang Tag Generator",
    description: "Generate hreflang alternate link tags for multilingual SEO.",
    href: "/tools/seo/hreflang",
    category: "seo",
    keywords: ["hreflang", "i18n", "multilingual"],
  }),
];

export const POPULAR_TOOLS = ALL_TOOLS.filter((t) => t.popular);

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return ALL_TOOLS.filter((t) => t.category === category);
}

export function searchTools(query: string): Tool[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return ALL_TOOLS;

  return ALL_TOOLS.filter((t) => {
    const haystack = [t.title, t.description, t.categoryLabel, ...(t.keywords ?? [])]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}
