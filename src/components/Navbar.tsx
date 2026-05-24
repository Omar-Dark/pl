import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Bell, Search, Settings, Sun, Moon, Crown, LogOut, User as UserIcon, ChevronDown, Code2 } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";

const NAV = [
  { to: "/roadmaps", label: "Roadmaps" },
  { to: "/library", label: "Library" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
] as const;

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { user, signOut } = useAuth();
  const { location } = useRouterState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand text-primary-foreground shadow-glow">
            <Code2 className="h-4 w-4" />
          </span>
          <span className="font-bold tracking-tight">DevPath</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {NAV.map((n) => {
            const active = location.pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  active ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="hidden lg:flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1.5 text-sm text-muted-foreground border border-border w-64">
          <Search className="h-4 w-4" />
          <input placeholder="Search paths..." className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground" />
        </div>

        <button onClick={toggle} aria-label="Toggle theme" className="grid h-9 w-9 place-items-center rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button className="grid h-9 w-9 place-items-center rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-destructive" />
        </button>
        <button className="grid h-9 w-9 place-items-center rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition">
          <Settings className="h-4 w-4" />
        </button>

        {user?.role === "admin" && (
          <Link
            to="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/10 px-3 py-1.5 text-xs font-semibold text-warning hover:bg-warning/20 transition"
          >
            <Crown className="h-3.5 w-3.5" />
            Admin Panel
          </Link>
        )}

        {user ? (
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen((o) => !o)} className="flex items-center gap-1 rounded-full border border-primary/30 p-0.5 hover:border-primary/60 transition">
              <Avatar name={user.fullName} avatar={user.avatar} size="sm" />
              <ChevronDown className="h-3 w-3 text-muted-foreground mx-1" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-border bg-popover p-1 shadow-xl">
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-popover-foreground hover:bg-secondary">
                  <UserIcon className="h-4 w-4" /> Profile
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-warning hover:bg-secondary">
                    <Crown className="h-4 w-4" /> Admin Panel
                  </Link>
                )}
                <button onClick={() => { signOut(); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-secondary">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/sign-in" className="rounded-md bg-gradient-brand px-3.5 py-1.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95 transition">
            Sign In
          </Link>
        )}

        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden grid h-9 w-9 place-items-center rounded-md hover:bg-secondary text-muted-foreground"
          aria-label="Menu"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setMobileOpen(false)} className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-secondary">
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

export function Avatar({ name, avatar, size = "md" }: { name: string; avatar?: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const dims = { sm: "h-7 w-7 text-xs", md: "h-10 w-10 text-sm", lg: "h-16 w-16 text-lg", xl: "h-20 w-20 text-xl" }[size];
  if (avatar) return <img src={avatar} alt={name} className={`${dims} rounded-full object-cover`} />;
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <span className={`${dims} grid place-items-center rounded-full bg-gradient-brand font-semibold text-primary-foreground shrink-0`}>
      {initials || "?"}
    </span>
  );
}
