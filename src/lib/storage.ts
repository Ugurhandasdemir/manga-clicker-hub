import { supabase } from "@/integrations/supabase/client";

// Supabase Storage utility functions
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function getMangaCoverUrl(coverKey: string): string {
  return getPublicUrl('manga-covers', coverKey);
}

export function getMangaPageUrl(pageKey: string): string {
  return getPublicUrl('manga-pages', pageKey);
}

// Upload functions
export async function uploadMangaCover(file: File, fileName: string) {
  const { data, error } = await supabase.storage
    .from('manga-covers')
    .upload(fileName, file);
  
  if (error) throw error;
  return data;
}

export async function uploadMangaPage(file: File, fileName: string) {
  const { data, error } = await supabase.storage
    .from('manga-pages')
    .upload(fileName, file);
  
  if (error) throw error;
  return data;
}

// Convert image to WebP format (browser-side)
export function convertToWebP(file: File, quality = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
                type: 'image/webp'
              });
              resolve(webpFile);
            } else {
              reject(new Error('Failed to convert to WebP'));
            }
          },
          'image/webp',
          quality
        );
      } else {
        reject(new Error('Canvas context not available'));
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}