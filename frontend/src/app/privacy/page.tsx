import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { LegalSection, StaticPage } from "@/components/layout/static-page";
import { siteConfig } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Privacy Policy",
  description: "How DreamConsole collects, uses, and protects your data when you use our free online tools.",
  path: "/privacy",
});

const LAST_UPDATED = "June 22, 2025";

export default function PrivacyPage() {
  return (
    <StaticPage
      title="Privacy Policy"
      description="Your privacy matters. This policy explains what data we collect and how we handle files you upload."
      lastUpdated={LAST_UPDATED}
    >
      <LegalSection title="Overview">
        <p>
          {siteConfig.name} ({siteConfig.url}) provides free online tools for images, PDFs, developers, and SEO
          professionals. We are committed to protecting your privacy and being transparent about our practices.
        </p>
      </LegalSection>

      <LegalSection title="Information we collect">
        <p>
          <strong>Usage data:</strong> We may collect anonymous analytics such as pages visited, browser type, device
          type, and general location (country/region) to improve our services.
        </p>
        <p>
          <strong>Uploaded files:</strong> For tools that process files on our servers (e.g. PDF merge, image
          compress), files are transmitted securely, processed only to complete your request, and deleted automatically
          afterward. We do not use your files to train AI models or share them with third parties.
        </p>
        <p>
          <strong>Browser-only tools:</strong> Some tools run entirely in your browser. For those tools, your data never
          leaves your device.
        </p>
        <p>
          <strong>Cookies:</strong> We use essential cookies for site functionality and may use analytics or advertising
          cookies in the future. You can control cookies through your browser settings.
        </p>
      </LegalSection>

      <LegalSection title="How we use your information">
        <ul className="list-disc pl-5 space-y-2">
          <li>To provide and improve our tools and website</li>
          <li>To monitor performance, security, and abuse prevention</li>
          <li>To comply with legal obligations</li>
        </ul>
      </LegalSection>

      <LegalSection title="Third-party services">
        <p>
          We may use third-party services for hosting, analytics, or advertising. These providers have their own privacy
          policies. If we integrate services such as Google AdSense, they may use cookies to serve ads based on your
          visits to this and other websites.
        </p>
      </LegalSection>

      <LegalSection title="Data retention">
        <p>
          Uploaded files are retained only for the duration needed to process your request and are deleted promptly
          after. Server logs may be kept for a limited period for security and debugging purposes.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          Depending on your location, you may have rights to access, correct, or delete personal data we hold about you.
          Contact us at{" "}
          <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            our contact page
          </Link>{" "}
          to make a request.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          Our services are not directed at children under 13. We do not knowingly collect personal information from
          children.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about this policy? Visit our{" "}
          <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Contact page
          </Link>
          .
        </p>
      </LegalSection>
    </StaticPage>
  );
}
