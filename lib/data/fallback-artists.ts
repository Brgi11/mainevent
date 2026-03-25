import type { ArtistCardModel } from "@/lib/wp/types";

/** Static cards from legacy `artists.html` when GraphQL is offline or misconfigured. */
export const FALLBACK_HOME_ARTISTS: ArtistCardModel[] = [
  {
    slug: "mirko-from-fjok",
    name: "mirko from fjok",
    typeLabel: "DJ",
    tagLabel: "",
    eventType: ["dj"],
    vibe: [],
    imageUrl:
      "https://eiz.hr/mainevent/wp-content/uploads/2026/02/Mirko-1.jpeg",
    hoverText:
      "Open-format DJ delivering a wide musical range and confident crowd reading.",
  },
  {
    slug: "jerry-dollan",
    name: "Jerry Dollan",
    typeLabel: "DJ",
    tagLabel: "",
    eventType: ["dj"],
    vibe: [],
    imageUrl:
      "https://eiz.hr/mainevent/wp-content/uploads/2026/02/Jerry-Dollan-1-scaled.jpg",
    hoverText:
      "Technically creative DJ with a sharp ear for detail and presentation.",
  },
  {
    slug: "jelena",
    name: "Jelena",
    typeLabel: "Pianist",
    tagLabel: "",
    eventType: ["pianist"],
    vibe: [],
    imageUrl:
      "https://eiz.hr/mainevent/wp-content/uploads/2026/02/Jelena-1.jpeg",
    hoverText:
      "Classically trained pianist for ceremonies and elegant dinner settings.",
  },
  {
    slug: "cola",
    name: "Cola",
    typeLabel: "DJ",
    tagLabel: "",
    eventType: ["dj"],
    vibe: [],
    imageUrl:
      "https://eiz.hr/mainevent/wp-content/uploads/2026/02/Cola-1.jpeg",
    hoverText:
      "Adaptable open-format DJ with strong people skills and musical flexibility.",
  },
  {
    slug: "vice",
    name: "Vice",
    typeLabel: "Saxophonist",
    tagLabel: "",
    eventType: ["saxophonist"],
    vibe: [],
    imageUrl:
      "https://eiz.hr/mainevent/wp-content/uploads/2026/02/Vice-1.jpeg",
    hoverText:
      "Seasoned saxophonist with a natural feel for atmosphere and crowd enjoyment.",
  },
  {
    slug: "luka",
    name: "Luka",
    typeLabel: "Saxophonist",
    tagLabel: "",
    eventType: ["saxophonist"],
    vibe: [],
    imageUrl:
      "https://eiz.hr/mainevent/wp-content/uploads/2026/02/Vice-1.jpeg",
    hoverText:
      "Classically trained saxophonist for solo sets and DJ combinations.",
  },
  {
    slug: "angelo",
    name: "Angelo",
    typeLabel: "Trumpet Player",
    tagLabel: "",
    eventType: ["trumpet player"],
    vibe: [],
    imageUrl:
      "https://eiz.hr/mainevent/wp-content/uploads/2026/02/Andelo-1.jpeg",
    hoverText: "High-impact trumpet player for peak party moments.",
  },
];
