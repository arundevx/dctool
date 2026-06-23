import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { LegalSection, StaticPage } from "@/components/layout/static-page";
import { siteConfig } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Terms of Service",
  description: "Terms and conditions for using DreamConsole free online tools.",
  path: "/terms",
});

const LAST_UPDATED = "June 22, 2025";

export default function TermsPage() {
  return (
    <StaticPage
      title="Terms of Service"
      description="Please read these terms carefully before using DreamConsole."
      lastUpdated={LAST_UPDATED}
    >
      <LegalSection title="Agreement">
        <p>
          By accessing or using {siteConfig.name} at {siteConfig.url}, you agree to these Terms of Service. If you do not
          agree, please do not use our website or tools.
        </p>
      </LegalSection>

      <LegalSection title="Use of our tools">
        <p>
          Our tools are provided free of charge for personal and lawful use. You may use them to process files you own or
          have permission to use. You are responsible for ensuring your use complies with applicable laws and
          third-party rights.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Do not upload illegal, harmful, or copyrighted content without authorization</li>
          <li>Do not attempt to disrupt, overload, or reverse-engineer our services</li>
          <li>Do not use automated systems to abuse or scrape the site excessively</li>
        </ul>
      </LegalSection>

      <LegalSection title="File processing">
        <p>
          Files uploaded for server-side processing are handled temporarily and deleted after your request completes. We
          do not guarantee permanent storage or recovery of uploaded files. You should keep your own backups.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          The DreamConsole website, branding, design, and original content are owned by us or our licensors. You retain
          ownership of content you upload. We do not claim ownership of your files.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimer of warranties">
        <p>
          Our tools are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind,
          express or implied. We do not guarantee that tools will be error-free, uninterrupted, or suitable for every
          purpose. Results may vary depending on file format, size, and content.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, {siteConfig.name} and its operators shall not be liable for any
          indirect, incidental, special, or consequential damages arising from your use of the site or tools, including
          loss of data or profits.
        </p>
      </LegalSection>

      <LegalSection title="Third-party content">
        <p>
          Some tools may fetch or process content from third-party URLs you provide. We are not responsible for
          third-party websites, services, or content. Use downloader and similar tools only for content you have the
          right to access.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may modify these terms at any time. Continued use of the site after changes constitutes acceptance of the
          updated terms.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          For questions about these terms, please visit our{" "}
          <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Contact page
          </Link>{" "}
          or review our{" "}
          <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>
    </StaticPage>
  );
}
