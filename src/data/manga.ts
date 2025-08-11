import cover1 from "@/assets/covers/cover1.jpg";
import cover2 from "@/assets/covers/cover2.jpg";
import cover3 from "@/assets/covers/cover3.jpg";
import cover4 from "@/assets/covers/cover4.jpg";
import cover5 from "@/assets/covers/cover5.jpg";
import cover6 from "@/assets/covers/cover6.jpg";

import page1 from "@/assets/pages/page1.jpg";
import page2 from "@/assets/pages/page2.jpg";
import page3 from "@/assets/pages/page3.jpg";

export type Chapter = {
  id: string;
  title: string;
  pages: string[];
};

export type Manga = {
  id: string;
  title: string;
  cover: string;
  tags?: string[];
  views?: number;
  chapters: Chapter[];
  updatedAt?: string;
};

const defaultPages = [page1, page2, page3];

export const mangas: Manga[] = [
  {
    id: "sword-city",
    title: "Kılıç Şehrinin Gezginı",
    cover: cover1,
    tags: ["Aksiyon", "Macera"],
    views: 12450,
    updatedAt: new Date().toISOString(),
    chapters: [
      { id: "1", title: "Bölüm 1", pages: defaultPages },
      { id: "2", title: "Bölüm 2", pages: defaultPages },
      { id: "3", title: "Bölüm 3", pages: defaultPages },
    ],
  },
  {
    id: "violet-arcana",
    title: "Menekşe Arcana",
    cover: cover2,
    tags: ["Fantezi", "Büyü"],
    views: 9980,
    chapters: [
      { id: "1", title: "Bölüm 1", pages: defaultPages },
      { id: "2", title: "Bölüm 2", pages: defaultPages },
    ],
  },
  {
    id: "neon-ace",
    title: "Neon As",
    cover: cover3,
    tags: ["Bilimkurgu", "Mecha"],
    views: 15230,
    chapters: [
      { id: "1", title: "Bölüm 1", pages: defaultPages },
      { id: "2", title: "Bölüm 2", pages: defaultPages },
      { id: "3", title: "Bölüm 3", pages: defaultPages },
      { id: "4", title: "Bölüm 4", pages: defaultPages },
    ],
  },
  {
    id: "forest-arrow",
    title: "Ormanın Oku",
    cover: cover4,
    tags: ["Macera"],
    views: 8430,
    chapters: [
      { id: "1", title: "Bölüm 1", pages: defaultPages },
      { id: "2", title: "Bölüm 2", pages: defaultPages },
    ],
  },
  {
    id: "titan-sun",
    title: "Güneşin Titanı",
    cover: cover5,
    tags: ["Aksiyon", "Dram"],
    views: 22010,
    chapters: [
      { id: "1", title: "Bölüm 1", pages: defaultPages },
    ],
  },
  {
    id: "rainy-noir",
    title: "Yağmurlu Sokaklar",
    cover: cover6,
    tags: ["Gizem", "Noir"],
    views: 6120,
    chapters: [
      { id: "1", title: "Bölüm 1", pages: defaultPages },
      { id: "2", title: "Bölüm 2", pages: defaultPages },
    ],
  },
];
