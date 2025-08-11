import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
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
        </nav>
      </div>
      <div className="h-[2px] bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0" />
    </header>
  );
};

export default Header;
