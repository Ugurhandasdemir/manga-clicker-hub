import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Manga } from "@/data/manga";

type Props = {
  manga: Manga;
  onOpen: (m: Manga) => void;
  className?: string;
};

const MangaCard = ({ manga, onOpen, className }: Props) => {
  return (
    <Card
      role="button"
      onClick={() => onOpen(manga)}
      className={cn(
        "group relative overflow-hidden border-0 bg-card/60 shadow-sm transition-all hover:shadow-lg focus-visible:ring-2",
        "rounded-lg",
        className
      )}
    >
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img
          src={manga.cover}
          alt={`${manga.title} kapak resmi`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="line-clamp-1 text-sm font-semibold">{manga.title}</div>
        {manga.tags && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {manga.tags.slice(0, 2).map((t) => (
              <Badge key={t} variant="secondary" className="text-[10px] px-2 py-0.5">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MangaCard;
