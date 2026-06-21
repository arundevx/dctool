import React from "react";
import { constructMetadata } from "@/lib/seo";
import UuidGeneratorClient from "./client";

export const metadata = constructMetadata({
  title: "UUID Generator",
  description: "Generate random Version 4 UUIDs (Universally Unique Identifiers) instantly in your browser.",
  path: "/tools/developer/uuid-generator",
});

export default function UuidGeneratorPage() {
  return <UuidGeneratorClient />;
}
