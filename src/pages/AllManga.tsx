import { useMemo, useState } from "react";
import { mangas, Manga } from "@/data/manga";
import MangaCard from "@/components/MangaCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AllManga = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Manga | null>(null);

  const list = useMemo(() => [...mangas], []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Manga Listesi</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {list.map((m) => (
          <MangaCard key={m.id} manga={m} onOpen={(mm) => { setSelected(mm); setOpen(true); }} />
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.title} • Bölümler</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            {selected?.chapters.map((c) => (
              <a key={c.id} href={`/read/${selected!.id}/${c.id}`} className="flex items-center justify-between rounded-md border p-3 hover:bg-accent">
                <span>{c.title}</span>
                <span className="text-sm text-muted-foreground">{selected?.title}</span>
              </a>
            ))}
          </div>
        </DialogContent>
      </Dialog>

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
