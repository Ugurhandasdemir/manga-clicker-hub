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

  // Güncellemeler: her mangadan en son bölümü al
  const updates = useMemo(() => {
    const items: { manga: Manga; chapterId: string; chapterTitle: string; uploadedAt: Date }[] = [];
    
    mangas.forEach((m, mangaIndex) => {
      // Her manga için en son bölümü al
      const lastChapter = m.chapters[m.chapters.length - 1];
      if (lastChapter) {
        // Her manga için farklı bir upload zamanı oluştur
        const uploadedAt = new Date(Date.now() - mangaIndex * 45 * 60 * 1000);
        items.push({ 
          manga: m, 
          chapterId: lastChapter.id, 
          chapterTitle: lastChapter.title, 
          uploadedAt 
        });
      }
    });
    
    return items.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()).slice(0, 10);
  }, []);


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

      {/* Güncellemeler - her satırda 2 kart */}
      <section aria-labelledby="updates-heading" className="container mx-auto px-4 pb-16">
        <h2 id="updates-heading" className="mb-5 text-xl font-semibold tracking-tight">Güncellenen Bölümler</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {updates.map((u) => (
            <Link
              key={`${u.manga.id}-${u.chapterId}`}
              to={`/manga/${u.manga.id}`}
              className="flex items-center gap-4 rounded-lg border bg-card p-3 transition-colors hover:bg-accent"
            >
              <img
                src={u.manga.cover}
                alt={`${u.manga.title} kapak`}
                loading="lazy"
                className="h-20 w-16 shrink-0 rounded-md object-cover"
              />
              <div className="min-w-0">
                <div className="line-clamp-1 font-medium">{u.manga.title}</div>
                <div className="text-sm text-muted-foreground">{u.chapterTitle}</div>
                <div className="text-xs text-muted-foreground">{formatRelative(u.uploadedAt)}</div>
              </div>
              <Button size="sm" variant="outline" className="ml-auto" asChild>
                <Link to={`/read/${u.manga.id}/${u.chapterId}`} onClick={(e) => e.stopPropagation()}>Oku</Link>
              </Button>
            </Link>
          ))}
        </div>
      </section>


      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Güncellenen Manga Bölümleri',
            itemListElement: updates.map((u, idx) => ({
              '@type': 'ListItem', position: idx + 1, name: `${u.manga.title} - ${u.chapterTitle}`,
            })),
          }),
        }}
      />
    </main>
  );
};

export default Index;
