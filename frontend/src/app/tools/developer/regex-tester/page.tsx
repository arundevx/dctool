import { constructMetadata } from "@/lib/seo";
import RegexTesterClient from "./client";

export const metadata = constructMetadata({
  title: "Regex Tester",
  description: "Test regular expressions against sample text in real time.",
  path: "/tools/developer/regex-tester",
});

export default function RegexTesterPage() {
  return <RegexTesterClient />;
}
