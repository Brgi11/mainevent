import type { Metadata } from "next";
import "@/styles/about-us.css";
import { AboutUsPageContent } from "@/components/pages/about-us-page-content";

export const metadata: Metadata = { title: "About us" };

export default function AboutUsPage() {
  return <AboutUsPageContent />;
}
