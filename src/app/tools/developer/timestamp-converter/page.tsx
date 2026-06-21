import React from "react";
import { constructMetadata } from "@/lib/seo";
import TimestampClient from "./client";

export const metadata = constructMetadata({
  title: "Unix Timestamp Converter",
  description: "Convert Unix timestamps to human-readable dates and dates to timestamps instantly.",
  path: "/tools/developer/timestamp-converter",
});

export default function TimestampPage() {
  return <TimestampClient />;
}
