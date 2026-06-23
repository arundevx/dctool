import { constructMetadata } from "@/lib/seo";
import MinifierClient from "./client";

export const metadata = constructMetadata({
  title: "HTML/CSS/JS Minifier",
  description: "Minify HTML, CSS, and JavaScript code to reduce file size.",
  path: "/tools/developer/minifier",
});

export default function MinifierPage() {
  return <MinifierClient />;
}
