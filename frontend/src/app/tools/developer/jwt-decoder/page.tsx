import { constructMetadata } from "@/lib/seo";
import JwtDecoderClient from "./client";

export const metadata = constructMetadata({
  title: "JWT Decoder",
  description: "Decode JSON Web Tokens and inspect header and payload.",
  path: "/tools/developer/jwt-decoder",
});

export default function JwtDecoderPage() {
  return <JwtDecoderClient />;
}
