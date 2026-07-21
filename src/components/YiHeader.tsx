import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function YiHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkCls = "px-3 py-2 rounded-md text-sm font-medium text-foreground/80 hover:text-primary transition-colors";
  const activeCls = { className: "px-3 py-2 rounded-md text-sm font-semibold text-primary" };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 bg-background transition-shadow ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <span className="text-2xl">🔑</span>
          <div className="min-w-0">
            <div className="font-bold text-lg leading-none text-foreground">YoungImmo</div>
            <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
              Ton appart, pas d'arnaque.
            </div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className={linkCls} activeOptions={{ exact: true }} activeProps={activeCls}>
            Accueil
          </Link>
          <Link to="/logements" className={linkCls} activeProps={activeCls}>
            Logements
          </Link>
          <Link to="/contact" className={linkCls} activeProps={activeCls}>
            Contact
          </Link>
        </nav>
        <button
          className="md:hidden p-2 rounded-md hover:bg-muted"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t bg-background">
          <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col">
            <Link to="/" className={linkCls} onClick={() => setOpen(false)}>Accueil</Link>
            <Link to="/logements" className={linkCls} onClick={() => setOpen(false)}>Logements</Link>
            <Link to="/contact" className={linkCls} onClick={() => setOpen(false)}>Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
}
