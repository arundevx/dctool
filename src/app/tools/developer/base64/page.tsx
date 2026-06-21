import React from "react";
import { constructMetadata } from "@/lib/seo";
import Base64Client from "./client";

export const metadata = constructMetadata({
  title: "Base64 Encoder & Decoder",
  description: "Encode text to Base64 or decode Base64 strings instantly in your browser.",
  path: "/tools/developer/base64",
});

export default function Base64Page() {
  return <Base64Client />;
}
