-- Create mangas table
CREATE TABLE public.mangas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  cover_key TEXT NOT NULL,
  tags TEXT[],
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chapters table
CREATE TABLE public.chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manga_id UUID NOT NULL REFERENCES public.mangas(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(manga_id, number)
);

-- Create pages table
CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  page_index INTEGER NOT NULL,
  object_key TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(chapter_id, page_index)
);

-- Enable Row Level Security
ALTER TABLE public.mangas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Mangas are viewable by everyone" 
ON public.mangas FOR SELECT USING (true);

CREATE POLICY "Chapters are viewable by everyone" 
ON public.chapters FOR SELECT USING (true);

CREATE POLICY "Pages are viewable by everyone" 
ON public.pages FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_chapters_manga_id ON public.chapters(manga_id);
CREATE INDEX idx_pages_chapter_id ON public.pages(chapter_id);
CREATE INDEX idx_mangas_views ON public.mangas(views DESC);
CREATE INDEX idx_mangas_updated_at ON public.mangas(updated_at DESC);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('manga-covers', 'manga-covers', true),
  ('manga-pages', 'manga-pages', true);

-- Create storage policies for public access
CREATE POLICY "Manga covers are publicly accessible" 
ON storage.objects FOR SELECT USING (bucket_id = 'manga-covers');

CREATE POLICY "Manga pages are publicly accessible" 
ON storage.objects FOR SELECT USING (bucket_id = 'manga-pages');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mangas_updated_at
  BEFORE UPDATE ON public.mangas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();