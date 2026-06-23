import { constructMetadata } from "@/lib/seo";
import PasswordGeneratorClient from "./client";

export const metadata = constructMetadata({
  title: "Password Generator",
  description: "Generate secure random passwords with custom options.",
  path: "/tools/developer/password-generator",
});

export default function PasswordGeneratorPage() {
  return <PasswordGeneratorClient />;
}
