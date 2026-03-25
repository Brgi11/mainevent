import { JournalPostView } from "@/components/journal/journal-post-view";
import { getJournalPostBySlug } from "@/lib/data/posts";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/styles/journal.css";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);
  if (!post?.title) return { title: "Journal" };
  return { title: post.title };
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);
  if (!post) notFound();
  return <JournalPostView post={post} />;
}
