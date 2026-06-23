import Link from "next/link";
import { constructMetadata, siteConfig } from "@/lib/seo";
import { LegalSection, StaticPage } from "@/components/layout/static-page";
import { Mail, MessageCircle } from "lucide-react";

export const metadata = constructMetadata({
  title: "Contact Us",
  description: "Get in touch with the DreamConsole team for support, feedback, or partnership inquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <StaticPage
      title="Contact Us"
      description="We'd love to hear from you — whether you have a question, feedback, or a tool suggestion."
    >
      <div className="not-prose space-y-6">
        <div className="flex gap-4 p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/[0.03]">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Mail className="h-6 w-6 text-indigo-500" />
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-1">Email</h2>
            <p className="text-muted-foreground text-sm mb-2">
              For support, bug reports, privacy requests, or general inquiries:
            </p>
            <a
              href="mailto:support@dreamconsole.org"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              support@dreamconsole.org
            </a>
          </div>
        </div>

        <div className="flex gap-4 p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/[0.03]">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-fuchsia-500/10 flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-fuchsia-500" />
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-1">Before you write</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Check our{" "}
              <Link href="/faq" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                FAQ
              </Link>{" "}
              for quick answers about file limits, privacy, and how our tools work. Include the tool name and steps to
              reproduce if reporting a bug.
            </p>
          </div>
        </div>

        <LegalSection title="About DreamConsole">
          <p>
            {siteConfig.name} is a free suite of online utilities at {siteConfig.url}, helping users convert images,
            manage PDFs, format code, and optimize content for the web.
          </p>
        </LegalSection>
      </div>
    </StaticPage>
  );
}
