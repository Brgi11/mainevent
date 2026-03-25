import type { Metadata } from "next";
import "@/styles/lighting.css";
import { LightingPageContent } from "@/components/pages/lighting-page-content";

export const metadata: Metadata = { title: "Lighting" };

export default function LightingPage() {
  return <LightingPageContent />;
}
