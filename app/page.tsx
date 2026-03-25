import { ArtistsHomeGrid } from "@/components/sections/artists-home-grid";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { JournalHomeSection } from "@/components/sections/journal-home-section";
import { PartnersSection } from "@/components/sections/partners-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { getArtistsForHome } from "@/lib/data/artists";
import { getAllJournalPosts, postToJournalCardModel } from "@/lib/data/posts";
import "@/styles/hero.css";
import "@/styles/artists.css";
import "@/styles/testimonials.css";
import "@/styles/contact.css";
import "@/styles/partners.css";
import "@/styles/journal-page.css";

export default async function HomePage() {
  const artists = await getArtistsForHome(12);
  const journalWp = await getAllJournalPosts(300);
  const journalCards = journalWp.map(postToJournalCardModel);

  return (
    <>
      <HeroSection />
      <ArtistsHomeGrid artists={artists} />
      <TestimonialsSection />
      <JournalHomeSection posts={journalCards} mode="home" />
      <ContactSection />
      <PartnersSection />
    </>
  );
}
