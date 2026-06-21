import React from "react";
import { constructMetadata } from "@/lib/seo";
import MetaTagsClient from "./client";

export const metadata = constructMetadata({
  title: "Meta Tag Generator",
  description: "Generate optimized HTML meta tags, OpenGraph, and Twitter cards for your website.",
  path: "/tools/seo/meta-tags",
});

export default function MetaTagsPage() {
  return <MetaTagsClient />;
}
