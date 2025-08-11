import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mangas } from "@/data/manga";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Reader = () => {
  const { mangaId, chapterId } = useParams();
  const navigate = useNavigate();

  const manga = useMemo(() => mangas.find((m) => m.id === mangaId), [mangaId]);
  const chapterIndex = useMemo(
    () => (manga ? manga.chapters.findIndex((c) => c.id === chapterId) : -1),
    [manga, chapterId]
  );
  const chapter = chapterIndex >= 0 && manga ? manga.chapters[chapterIndex] : undefined;

  const goPrev = () => {
    if (!manga || chapterIndex <= 0) return;
    const prev = manga.chapters[chapterIndex - 1];
    navigate(`/read/${manga.id}/${prev.id}`);
  };
  const goNext = () => {
    if (!manga || chapterIndex >= (manga?.chapters.length || 0) - 1) return;
    const next = manga.chapters[chapterIndex + 1];
    navigate(`/read/${manga.id}/${next.id}`);
  };

  const handleChapterChange = (newChapterId: string) => {
    if (manga) {
      navigate(`/read/${manga.id}/${newChapterId}`);
    }
  };

  if (!manga || !chapter) {
    return (
      <main className="container mx-auto max-w-5xl py-10">
        <p>Bu bölüm bulunamadı.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="sticky top-16 z-20 border-b bg-background/90 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center gap-2">
          <Button variant="secondary" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Geri
          </Button>
          <div className="ml-2 flex items-center gap-3">
            <span className="text-sm font-medium">{manga.title}</span>
            <Select value={chapterId} onValueChange={handleChapterChange}>
              <SelectTrigger className="w-auto min-w-[140px] h-8">
                <SelectValue placeholder="Bölüm seçin" />
              </SelectTrigger>
              <SelectContent>
                {manga.chapters.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" onClick={goPrev} disabled={chapterIndex <= 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={goNext}
              disabled={chapterIndex >= manga.chapters.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        {chapter.pages.map((src, i) => (
          <figure key={i} className="mb-4">
            <img
              src={src}
              alt={`${manga.title} - ${chapter.title} sayfa ${i + 1}`}
              loading="lazy"
              className="mx-auto w-full rounded-md bg-muted object-contain"
            />
          </figure>
        ))}
      </div>
    </main>
  );
};

export default Reader;
