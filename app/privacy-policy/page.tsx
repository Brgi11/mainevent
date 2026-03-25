import type { Metadata } from "next";
import "@/styles/legal-page.css";
import { PrivacyPolicyContent } from "@/components/pages/privacy-policy-content";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
}
