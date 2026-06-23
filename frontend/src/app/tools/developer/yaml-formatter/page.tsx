import { constructMetadata } from "@/lib/seo";
import YamlFormatterClient from "./client";

export const metadata = constructMetadata({
  title: "YAML Formatter",
  description: "Format, validate, and convert YAML data.",
  path: "/tools/developer/yaml-formatter",
});

export default function YamlFormatterPage() {
  return <YamlFormatterClient />;
}
