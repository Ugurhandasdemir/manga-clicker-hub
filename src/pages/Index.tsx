import { useMemo, useState } from "react";
import { mangas, Manga } from "@/data/manga";
import MangaCard from "@/components/MangaCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

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
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Manga | null>(null);

  const popular = useMemo(() => [...mangas].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6), []);

  // Güncellemeler: örnek zamanlar üret
  const updates = useMemo(() => {
    const items: { manga: Manga; chapterId: string; chapterTitle: string; uploadedAt: Date }[] = [];
    let step = 0;
    mangas.forEach((m) => {
      m.chapters.forEach((c) => {
        // Her bölüm için dakika adımını artır
        const uploadedAt = new Date(Date.now() - step * 37 * 60 * 1000);
        items.push({ manga: m, chapterId: c.id, chapterTitle: c.title, uploadedAt });
        step += 1;
      });
    });
    return items.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()).slice(0, 10);
  }, []);

  const handleOpen = (m: Manga) => {
    setSelected(m);
    setOpen(true);
  };

  return (
    <main>
      {/* Yalnızca tek bir H1 - SEO */}
      <section className="container mx-auto px-4 pt-8">
        <h1 className="sr-only">Güncel Manga Bölümleri ve Popüler Seriler</h1>
      </section>

      <section id="popular" aria-labelledby="popular-heading" className="container mx-auto px-4 py-8">
        <h2 id="popular-heading" className="mb-5 text-xl font-semibold tracking-tight">Bugün En Çok Görüntülenenler</h2>
        <div className="relative">
          <Carousel opts={{ align: "start", slidesToScroll: 2, containScroll: "trimSnaps" }}>
            <CarouselContent>
              {popular.map((m) => (
                <CarouselItem key={m.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
                  <MangaCard manga={m} onOpen={handleOpen} />
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
            <div
              key={`${u.manga.id}-${u.chapterId}`}
              onClick={() => handleOpen(u.manga)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") handleOpen(u.manga); }}
              className="flex items-center gap-4 rounded-lg border bg-card p-3 transition-colors hover:bg-accent cursor-pointer"
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
            </div>
          ))}
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>{selected?.title}</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <Tabs defaultValue="about">
              <TabsList className="mb-4">
                <TabsTrigger value="about">Hakkında</TabsTrigger>
                <TabsTrigger value="chapters">Bölümler</TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <div className="grid gap-4 md:grid-cols-[160px,1fr]">
                  <img
                    src={selected?.cover ?? ''}
                    alt={`${selected?.title ?? 'Manga'} kapak`}
                    className="h-48 w-full max-w-[160px] rounded-md object-cover md:h-56"
                  />
                  <div>
                    {selected?.tags && (
                      <div className="flex flex-wrap gap-2">
                        {selected.tags.map((t) => (
                          <Badge key={t} variant="secondary">{t}</Badge>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Eye className="h-4 w-4" />{selected?.views?.toLocaleString?.('tr-TR') ?? 0} görüntülenme</span>
                      <span>{selected?.chapters.length ?? 0} bölüm</span>
                    </div>
                    {selected?.updatedAt && (
                      <div className="mt-1 text-xs text-muted-foreground">Son Güncelleme: {new Date(selected.updatedAt).toLocaleString('tr-TR')}</div>
                    )}
                    {selected && selected.chapters?.[0] && (
                      <div className="mt-4">
                        <Link to={`/read/${selected.id}/${selected.chapters[0].id}`} onClick={() => setOpen(false)}>
                          <Button>İlk Bölümü Oku</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="chapters">
                <div className="grid gap-2">
                  {selected?.chapters.map((c) => (
                    <Link key={c.id} to={`/read/${selected!.id}/${c.id}`} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-md border p-3 hover:bg-accent">
                      <span>{c.title}</span>
                      <Button size="sm" variant="outline">Oku</Button>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

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
