import React from "react";
import { constructMetadata } from "@/lib/seo";
import ImageConvertClient from "./client";
import { notFound } from "next/navigation";

// Allowed formats to prevent invalid URLs
const ALLOWED_FORMATS = ["png", "jpg", "jpeg", "webp", "heic", "heif"];

export async function generateMetadata({ params }: { params: Promise<{ conversion: string }> }) {
  const resolvedParams = await params;
  const parts = resolvedParams.conversion.split("-to-");
  if (parts.length !== 2) {
    return constructMetadata({
      title: "Image Converter",
      description: "Free online image format converter.",
      path: "/tools/image",
    });
  }
  
  const from = parts[0].toUpperCase();
  const to = parts[1].toUpperCase();

  return constructMetadata({
    title: `Convert ${from} to ${to}`,
    description: `Free online tool to convert ${from} images to ${to} format instantly and securely.`,
    path: `/tools/image/convert/${resolvedParams.conversion}`,
  });
}

export default async function ImageConvertPage({ params }: { params: Promise<{ conversion: string }> }) {
  const resolvedParams = await params;
  const parts = resolvedParams.conversion.split("-to-");
  
  if (parts.length !== 2) {
    notFound();
  }

  const from = parts[0];
  const to = parts[1];

  if (!ALLOWED_FORMATS.includes(from.toLowerCase()) || !ALLOWED_FORMATS.includes(to.toLowerCase())) {
    notFound();
  }

  return <ImageConvertClient fromFormat={from.toUpperCase()} toFormat={to.toUpperCase()} />;
}
