import { useMemo, useState } from "react";
import { mangas, Manga } from "@/data/manga";
import MangaCard from "@/components/MangaCard";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";

function formatRelative(date: Date) {
  const diff = Math.max(0, Date.now() - date.getTime());
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m} dakika önce`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} saat önce`;
  const d = Math.floor(h / 24);
  return `${d} gün önce`;
}

const Index = () => {

  const popular = useMemo(() => [...mangas].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6), []);

  // Güncellemeler: her mangadan en son 3 bölümü al
  const updates = useMemo(() => {
    const items: { manga: Manga; chapters: { id: string; title: string; uploadedAt: Date }[] }[] = [];

    mangas.forEach((m, mangaIndex) => {
      // Her manga için en son 3 bölümü al
      const last3Chapters = m.chapters
        .slice(-3)
        .reverse()
        .map((chapter, chapterIndex) => ({
          id: chapter.id,
          title: chapter.title,
          uploadedAt: new Date(Date.now() - (mangaIndex * 3 + chapterIndex) * 15 * 60 * 1000),
        }));

      if (last3Chapters.length > 0) {
        items.push({ manga: m, chapters: last3Chapters });
      }
    });

    return items
      .sort((a, b) => b.chapters[0].uploadedAt.getTime() - a.chapters[0].uploadedAt.getTime())
      .slice(0, 8);
  }, []);


  // Sidebar: Popüler ve Yeni Seriler
  const sidebarPopular = useMemo(() => [...mangas].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 8), []);
  const newSeries = useMemo(
    () =>
      mangas
        .map((m, mangaIndex) => ({ manga: m, uploadedAt: new Date(Date.now() - mangaIndex * 3 * 15 * 60 * 1000) }))
        .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
        .slice(0, 8)
        .map((i) => i.manga),
    []
  );


  return (
    <main>
      {/* Yalnızca tek bir H1 - SEO */}
      <section className="container mx-auto px-4 pt-8">
        <h1 className="sr-only">Güncel Manga Bölümleri ve Popüler Seriler</h1>
      </section>

      <section id="popular" aria-labelledby="popular-heading" className="container mx-auto px-4 py-8">
        <h2 id="popular-heading" className="mb-5 text-xl font-semibold tracking-tight">Bugün En Çok Görüntülenenler</h2>
        <div className="relative">
          <Carousel 
            opts={{ align: "start", slidesToScroll: 2, containScroll: "trimSnaps", loop: true }} 
            plugins={[Autoplay({ delay: 3000 })]}
          >
            <CarouselContent>
              {popular.map((m) => (
                <CarouselItem key={m.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
                  <MangaCard manga={m} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* İçerik: Güncellenen Bölümler */}
        <section aria-labelledby="updates-heading" className="lg:col-span-9">
          <h2 id="updates-heading" className="mb-5 text-xl font-semibold tracking-tight">Güncellenen Bölümler</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {updates.map((u) => (
              <div key={u.manga.id} className="rounded-lg border bg-card p-5">
                <div className="grid grid-cols-[auto,1fr] gap-4 items-start">
                  <Link to={`/manga/${u.manga.id}`} className="row-span-2 hover:opacity-90 transition-opacity">
                    <img
                      src={u.manga.cover}
                      alt={`${u.manga.title} kapak`}
                      loading="lazy"
                      className="h-40 w-32 shrink-0 rounded-md object-cover"
                    />
                  </Link>

                  <Link to={`/manga/${u.manga.id}`} className="min-w-0 hover:opacity-90 transition-opacity">
                    <h3 className="line-clamp-1 text-lg font-semibold">{u.manga.title}</h3>
                  </Link>

                  <ul className="space-y-1.5">
                    {u.chapters.map((chapter) => (
                      <li key={chapter.id} className="flex items-center justify-between">
                        <div className="min-w-0 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                          <span className="text-sm font-medium truncate">{chapter.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0 tabular-nums">{formatRelative(chapter.uploadedAt)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sidebar: Sağ tarafta Popüler ve Yeni Seriler */}
        <aside className="hidden lg:block lg:col-span-3" aria-labelledby="sidebar-heading">
          <div className="sticky top-24 space-y-6">
            <section aria-labelledby="sidebar-popular">
              <h3 id="sidebar-popular" className="mb-3 text-base font-semibold tracking-tight">Popüler Seriler</h3>
              <ul className="divide-y">
                {sidebarPopular.map((m, idx) => (
                  <li key={m.id} className="py-3">
                    <Link to={`/manga/${m.id}`} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-foreground text-xs font-medium">
                        {idx + 1}
                      </span>
                      <img
                        src={m.cover}
                        alt={`${m.title} kapak`}
                        loading="lazy"
                        className="h-14 w-10 shrink-0 rounded object-cover"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium line-clamp-2">{m.title}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="sidebar-new">
              <h3 id="sidebar-new" className="mb-3 text-base font-semibold tracking-tight">Yeni Seriler</h3>
              <ul className="divide-y">
                {newSeries.map((m, idx) => (
                  <li key={m.id} className="py-3">
                    <Link to={`/manga/${m.id}`} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-foreground text-xs font-medium">
                        {idx + 1}
                      </span>
                      <img
                        src={m.cover}
                        alt={`${m.title} kapak`}
                        loading="lazy"
                        className="h-14 w-10 shrink-0 rounded object-cover"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium line-clamp-2">{m.title}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </aside>
      </div>



      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Güncellenen Manga Bölümleri',
            itemListElement: updates.flatMap((u) => 
              u.chapters.map((chapter, chapterIdx) => ({
                '@type': 'ListItem', 
                position: chapterIdx + 1, 
                name: `${u.manga.title} - ${chapter.title}`,
              }))
            ),
          }),
        }}
      />
    </main>
  );
};

export default Index;
