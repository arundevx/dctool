import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { StaticPage } from "@/components/layout/static-page";
import { FaqAccordion } from "./faq-accordion";

export const metadata = constructMetadata({
  title: "FAQ",
  description: "Frequently asked questions about DreamConsole free online tools, file privacy, and usage.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <StaticPage
      title="Frequently Asked Questions"
      description="Quick answers about how DreamConsole works, file safety, and getting the most from our tools."
    >
      <FaqAccordion />
      <p className="not-prose mt-10 text-sm text-muted-foreground text-center">
        Still have questions?{" "}
        <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
          Contact us
        </Link>
      </p>
    </StaticPage>
  );
}
