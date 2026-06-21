import React from "react";
import { constructMetadata } from "@/lib/seo";
import PdfMergeClient from "./client";

export const metadata = constructMetadata({
  title: "Merge PDF Files",
  description: "Combine multiple PDF documents into a single file easily and securely.",
  path: "/tools/pdf/merge",
});

export default function PdfMergePage() {
  return <PdfMergeClient />;
}
