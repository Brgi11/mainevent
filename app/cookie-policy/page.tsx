import type { Metadata } from "next";
import "@/styles/legal-page.css";
import { CookiePolicyContent } from "@/components/pages/cookie-policy-content";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function CookiePolicyPage() {
  return <CookiePolicyContent />;
}
