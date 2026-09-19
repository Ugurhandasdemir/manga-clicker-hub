# Manga Clicker Hub

Manga okuma sitesi arayüzü: kapak kartlarıyla katalog, seri detay sayfası ve sayfa sayfa okuyucu. React + TypeScript ile yazıldı, veri ve görsel altyapısı için Supabase şeması içerir.

## Özellikler

- **Ana sayfa ve katalog** (`/`, `/manga`): kapak kartları, seri listesi.
- **Seri detayı** (`/manga/:id`): bölüm listesi.
- **Okuyucu** (`/read/:mangaId/:chapterId`): bölüm sayfalarını sırayla gösterir.
- **Tema desteği:** açık/koyu tema.
- **Supabase entegrasyonu:** `mangas`, `chapters`, `pages` tabloları ve `manga-covers` / `manga-pages` depolama kovaları için şema ve yardımcı fonksiyonlar; tarayıcıda WebP dönüşümü ile yükleme (`src/lib/storage.ts`).

## Teknoloji Yığını

Vite, React 18, TypeScript, React Router 6, TanStack Query, Tailwind CSS, shadcn/ui, Supabase.

## Kurulum

```bash
git clone https://github.com/Ugurhandasdemir/manga-clicker-hub.git
cd manga-clicker-hub
npm install
npm run dev
```

Kendi Supabase projenizi kullanmak için `src/integrations/supabase/client.ts` içindeki URL ve anahtarı değiştirin, `supabase/migrations/` altındaki SQL dosyasını projenize uygulayın ve `manga-covers` ile `manga-pages` kovalarını oluşturun.

## Proje Yapısı

```
src/
├── pages/          # Index, AllManga, MangaDetail, Reader, NotFound
├── components/     # Header, MangaCard, ThemeProvider, shadcn/ui bileşenleri
├── data/manga.ts   # örnek katalog verisi
├── lib/storage.ts  # Supabase Storage yardımcıları
└── integrations/supabase/
supabase/migrations/  # veritabanı şeması
```

> Proje [Lovable](https://lovable.dev) ile başlatılmıştır.
