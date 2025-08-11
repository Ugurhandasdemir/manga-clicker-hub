import { useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { mangas } from "@/data/manga";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ArrowLeft } from "lucide-react";

const MangaDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const manga = useMemo(() => mangas.find(m => m.id === id), [id]);

  if (!manga) {
    return <Navigate to="/manga" replace />;
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Ana Sayfa
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px,1fr]">
        <div className="space-y-4">
          <img
            src={manga.cover}
            alt={`${manga.title} kapak resmi`}
            className="w-full rounded-lg shadow-lg"
          />
          <div className="space-y-3">
            {manga.chapters?.[0] && (
              <Link to={`/read/${manga.id}/${manga.chapters[0].id}`} className="block">
                <Button className="w-full" size="lg">İlk Bölümü Oku</Button>
              </Link>
            )}
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {manga.views?.toLocaleString?.('tr-TR') ?? 0} görüntülenme
              </div>
              <div>{manga.chapters.length} bölüm</div>
              {manga.updatedAt && (
                <div>Son Güncelleme: {new Date(manga.updatedAt).toLocaleString('tr-TR')}</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{manga.title}</h1>
            {manga.tags && (
              <div className="flex flex-wrap gap-2">
                {manga.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
          </div>

          <Tabs defaultValue="about" className="w-full">
            <TabsList>
              <TabsTrigger value="about">Hakkında</TabsTrigger>
              <TabsTrigger value="chapters">Bölümler</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-muted-foreground">
                  {manga.title} - {manga.tags?.join(', ')} türünde bir manga serisidir.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Durum:</strong> Devam Ediyor
                  </div>
                  <div>
                    <strong>Bölüm Sayısı:</strong> {manga.chapters.length}
                  </div>
                  <div>
                    <strong>Görüntülenme:</strong> {manga.views?.toLocaleString?.('tr-TR') ?? 0}
                  </div>
                  <div>
                    <strong>Kategoriler:</strong> {manga.tags?.join(', ') ?? 'Belirtilmemiş'}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chapters" className="mt-6">
              <div className="space-y-2">
                {manga.chapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    to={`/read/${manga.id}/${chapter.id}`}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <span className="font-medium">{chapter.title}</span>
                    <Button size="sm" variant="outline">Oku</Button>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Book',
            name: manga.title,
            image: manga.cover,
            author: { '@type': 'Organization', name: 'MangaWave' },
            genre: manga.tags,
            numberOfPages: manga.chapters.length,
            aggregateRating: manga.views ? {
              '@type': 'AggregateRating',
              ratingValue: '4.5',
              reviewCount: Math.floor((manga.views || 0) / 100)
            } : undefined,
          }),
        }}
      />
    </main>
  );
};

export default MangaDetail;