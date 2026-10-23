import { constructMetadata } from "@/lib/seo";
import DownloaderClient from "./client";

export const metadata = constructMetadata({
  title: "Pulse Downloader — Universal Video & Audio Download",
  description:
    "Professional media downloader powered by yt-dlp. Best quality video merge, MP3/M4A audio extraction, and support for 1000+ sites.",
  path: "/tools/downloader",
});

export default function DownloaderPage() {
  return <DownloaderClient />;
}
