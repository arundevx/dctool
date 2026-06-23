import { constructMetadata } from "@/lib/seo";
import ColorConverterClient from "./client";

export const metadata = constructMetadata({
  title: "Color Picker & Extractor",
  description: "Pick colors, convert HEX↔RGB, and extract palettes from images or websites.",
  path: "/tools/developer/color-converter",
});

export default function ColorConverterPage() {
  return <ColorConverterClient />;
}
