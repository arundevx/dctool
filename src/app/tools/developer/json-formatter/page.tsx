import React from "react";
import { constructMetadata } from "@/lib/seo";
import JsonFormatterClient from "./client";

export const metadata = constructMetadata({
  title: "JSON Formatter & Validator",
  description: "Format, validate, and minify your JSON data instantly in the browser.",
  path: "/tools/developer/json-formatter",
});

export default function JsonFormatterPage() {
  return <JsonFormatterClient />;
}
