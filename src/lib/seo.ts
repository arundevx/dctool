import { Metadata } from "next";

interface GenerateMetadataProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
}

export const siteConfig = {
  name: "DreamConsole",
  url: "https://dreamconsole.org",
  description: "A comprehensive suite of free online tools including Image converters, PDF manipulators, Developer utilities, and SEO generators.",
  defaultImage: "https://dreamconsole.org/og-image.jpg",
  twitterHandle: "@dreamconsole",
};

export function constructMetadata({
  title,
  description,
  path,
  image = siteConfig.defaultImage,
  noindex = false,
}: GenerateMetadataProps): Metadata {
  const url = `${siteConfig.url}${path}`;

  return {
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: siteConfig.twitterHandle,
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
