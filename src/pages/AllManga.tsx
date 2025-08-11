import { useMemo } from "react";
import { mangas } from "@/data/manga";
import MangaCard from "@/components/MangaCard";

const AllManga = () => {

  const list = useMemo(() => [...mangas], []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Manga Listesi</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {list.map((m) => (
          <MangaCard key={m.id} manga={m} />
        ))}
      </div>


      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Manga Listesi',
            itemListElement: list.map((m, idx) => ({ '@type': 'ListItem', position: idx + 1, name: m.title })),
          }),
        }}
      />
    </main>
  );
};

export default AllManga;
