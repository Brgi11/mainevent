import type { Metadata } from "next";
import "@/styles/legal-page.css";
import { TermsOfUseContent } from "@/components/pages/terms-of-use-content";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsOfUsePage() {
  return <TermsOfUseContent />;
}
