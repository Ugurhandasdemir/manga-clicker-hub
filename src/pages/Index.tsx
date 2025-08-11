import { useMemo, useState } from "react";
import { mangas, Manga } from "@/data/manga";
import MangaCard from "@/components/MangaCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {popular.map((m) => (
            <MangaCard key={m.id} manga={m} onOpen={handleOpen} />
          ))}
        </div>
      </section>

      {/* Güncellemeler - her satırda 2 kart */}
      <section aria-labelledby="updates-heading" className="container mx-auto px-4 pb-16">
        <h2 id="updates-heading" className="mb-5 text-xl font-semibold tracking-tight">Güncellenen Bölümler</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {updates.map((u) => (
            <Link
              key={`${u.manga.id}-${u.chapterId}`}
              to={`/read/${u.manga.id}/${u.chapterId}`}
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
              <Button size="sm" variant="outline" className="ml-auto">Oku</Button>
            </Link>
          ))}
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.title} • Bölümler</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            {selected?.chapters.map((c) => (
              <Link key={c.id} to={`/read/${selected.id}/${c.id}`} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-md border p-3 hover:bg-accent">
                <span>{c.title}</span>
                <Button size="sm" variant="outline">Oku</Button>
              </Link>
            ))}
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
