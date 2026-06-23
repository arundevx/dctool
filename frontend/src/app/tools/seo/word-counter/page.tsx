import { constructMetadata } from "@/lib/seo";
import WordCounterClient from "./client";

export const metadata = constructMetadata({
  title: "Word & Character Counter",
  description: "Count words, characters, lines, and sentences in your text.",
  path: "/tools/seo/word-counter",
});

export default function WordCounterPage() {
  return <WordCounterClient />;
}
