import { constructMetadata } from "@/lib/seo";
import QrCodeClient from "./client";

export const metadata = constructMetadata({
  title: "QR Code Generator",
  description: "Generate QR codes from text or URLs.",
  path: "/tools/developer/qr-code",
});

export default function QrCodePage() {
  return <QrCodeClient />;
}
