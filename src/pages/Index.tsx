import { useMemo, useState } from "react";
import { mangas, Manga } from "@/data/manga";
import Header from "@/components/Header";
import MangaCard from "@/components/MangaCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Manga | null>(null);

  const popular = useMemo(() => [...mangas].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6), []);
  const newest = useMemo(() => [...mangas].reverse(), []);

  const handleOpen = (m: Manga) => {
    setSelected(m);
    setOpen(true);
  };

  return (
    <main>
      {/* SEO - Tekil H1 */}
      <section className="relative border-b bg-muted/20">
        <div className="container mx-auto grid gap-6 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              MangaWave ile Türkçe Manga Oku
            </h1>
            <p className="mt-4 max-w-prose text-muted-foreground">
              En yeni bölümler ve popüler serileri tek tıkla keşfet. Kapaklara tıkla, bölümleri aç ve hemen okumaya başla.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#popular"><Button>Popüler Seriler</Button></a>
              <a href="#new"><Button variant="secondary">Yeni Bölümler</Button></a>
            </div>
          </div>
          <div className="hidden md:block rounded-xl border bg-card p-4">
            <div className="grid grid-cols-3 gap-3">
              {popular.slice(0, 6).map((m) => (
                <img key={m.id} src={m.cover} alt={`${m.title} kapak`} className="aspect-[3/4] w-full rounded-md object-cover" loading="lazy" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="popular" aria-labelledby="popular-heading" className="container mx-auto px-4 py-10">
        <h2 id="popular-heading" className="mb-5 text-xl font-semibold tracking-tight">Bugün En Çok Görüntülenenler</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {popular.map((m) => (
            <MangaCard key={m.id} manga={m} onOpen={handleOpen} />
          ))}
        </div>
      </section>

      <section id="new" aria-labelledby="new-heading" className="container mx-auto px-4 pb-16">
        <h2 id="new-heading" className="mb-5 text-xl font-semibold tracking-tight">Yeni</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {newest.map((m) => (
            <MangaCard key={m.id} manga={m} onOpen={handleOpen} />
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
            name: 'Manga Listesi',
            itemListElement: popular.map((m, idx) => ({
              '@type': 'ListItem', position: idx + 1, name: m.title,
            })),
          }),
        }}
      />
    </main>
  );
};

export default Index;
