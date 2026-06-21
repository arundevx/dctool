import React from "react";
import { constructMetadata } from "@/lib/seo";
import RobotsClient from "./client";

export const metadata = constructMetadata({
  title: "Robots.txt Generator",
  description: "Easily generate a robots.txt file to control how search engines crawl your site.",
  path: "/tools/seo/robots",
});

export default function RobotsPage() {
  return <RobotsClient />;
}
