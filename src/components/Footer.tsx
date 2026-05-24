import { Link } from "@tanstack/react-router";
import { Terminal, Globe, Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-bold tracking-tight">DevPath</div>
          <p className="mt-1 text-xs text-muted-foreground">© 2026 DevPath IDE. Built for precision.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground">Documentation</a>
          <a href="#" className="hover:text-foreground">Changelog</a>
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Discord</a>
          <Link to="/about" className="hover:text-foreground">About</Link>
        </nav>
        <div className="flex items-center gap-2 text-muted-foreground">
          <a href="#" className="grid h-8 w-8 place-items-center rounded-md border border-border hover:bg-secondary"><Terminal className="h-4 w-4" /></a>
          <a href="#" className="grid h-8 w-8 place-items-center rounded-md border border-border hover:bg-secondary"><Globe className="h-4 w-4" /></a>
          <a href="#" className="grid h-8 w-8 place-items-center rounded-md border border-border hover:bg-secondary"><Code2 className="h-4 w-4" /></a>
        </div>
      </div>
    </footer>
  );
}
