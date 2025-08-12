import { BookOpen, Sun, Moon, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { mangas } from "@/data/manga";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
            <BookOpen className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">MangaWave</span>
        </Link>
        <nav className="ml-auto flex items-center gap-2">
          <Link to="/manga">
            <Button variant="secondary" size="sm">Manga Listesi</Button>
          </Link>
          <Button
            variant="secondary"
            size="sm"
            aria-label="Ara"
            onClick={() => setOpen(true)}
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </nav>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Seri ara..." />
          <CommandList>
            <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
            <CommandGroup heading="Seriler">
              {mangas.map((m) => (
                <CommandItem
                  key={m.id}
                  value={m.title}
                  onSelect={() => {
                    navigate(`/manga/${m.id}`)
                    setOpen(false)
                  }}
                >
                  <img src={m.cover} alt={`${m.title} kapak`} className="mr-2 h-8 w-6 rounded object-cover" />
                  <span className="truncate">{m.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className="h-[2px] bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0" />
    </header>
  );
};

export default Header;
