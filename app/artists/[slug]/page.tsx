import { ArtistSingleView } from "@/components/artists/artist-single-view";
import { getArtistDisplayName, getArtistPost } from "@/lib/data/artists";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/styles/artist-single.css";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getArtistPost(slug);
  if (!post) return { title: "Artist" };
  return { title: getArtistDisplayName(post) };
}

export default async function ArtistSinglePage({ params }: Props) {
  const { slug } = await params;
  const post = await getArtistPost(slug);
  if (!post) notFound();
  return <ArtistSingleView post={post} />;
}
