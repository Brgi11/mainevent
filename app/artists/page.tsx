import { ArtistsArchiveClient } from "@/components/artists/artists-archive-client";
import { getArtistsArchiveFromWordPress } from "@/lib/data/artists";
import "@/styles/artists-page.css";

export const revalidate = 60;

export default async function ArtistsPage() {
  const { artists, status, errorDetail } =
    await getArtistsArchiveFromWordPress({ maxArtists: 500 });

  return (
    <ArtistsArchiveClient
      artists={artists}
      loadStatus={status}
      errorDetail={errorDetail}
      categoryFilter={process.env.ARTISTS_GRAPHQL_CATEGORY ?? "Artist"}
    />
  );
}
