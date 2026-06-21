import { constructMetadata } from "@/lib/seo";
import DownloaderClient from "./client";

export const metadata = constructMetadata({
  title: "Online Video Downloader",
  description: "Download videos and audio from hundreds of supported websites in high quality.",
  path: "/tools/downloader",
});

export default function DownloaderPage() {
  return <DownloaderClient />;
}
