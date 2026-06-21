import React from "react";
import { constructMetadata } from "@/lib/seo";
import ImageCompressClient from "./client";

export const metadata = constructMetadata({
  title: "Image Compressor",
  description: "Compress images online for free without losing quality.",
  path: "/tools/image/compress",
});

export default function ImageCompressPage() {
  return <ImageCompressClient />;
}
