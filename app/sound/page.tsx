import type { Metadata } from "next";
import "@/styles/sound.css";
import { SoundPageContent } from "@/components/pages/sound-page-content";

export const metadata: Metadata = { title: "Sound" };

export default function SoundPage() {
  return <SoundPageContent />;
}
