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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const desktopLink =
    "px-3 py-2 rounded-md text-sm font-medium text-foreground/80 hover:text-primary transition-colors";
  const desktopActive = {
    className: "px-3 py-2 rounded-md text-sm font-semibold text-primary",
  };

  const mobileLink =
    "flex items-center gap-3 px-4 py-4 rounded-xl text-base font-medium text-foreground hover:bg-muted transition-colors";
  const mobileActive = {
    className:
      "flex items-center gap-3 px-4 py-4 rounded-xl text-base font-semibold text-primary bg-primary/10",
  };

  const close = () => setOpen(false);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 bg-background transition-shadow ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 md:flex md:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2" onClick={close}>
          <span className="text-2xl shrink-0">🔑</span>
          <div className="min-w-0">
            <div className="truncate font-display font-semibold text-xl leading-none text-foreground">
              YoungImmo
            </div>
            <div className="truncate text-[10px] text-muted-foreground leading-tight mt-0.5">
              Ton appart, pas d'arnaque.
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={desktopLink}
            activeOptions={{ exact: true }}
            activeProps={desktopActive}
          >
            Accueil
          </Link>
          <Link to="/logements" className={desktopLink} activeProps={desktopActive}>
            Logements
          </Link>
          <Link to="/carte" className={desktopLink} activeProps={desktopActive}>
            Carte
          </Link>
          <Link to="/saisie-prix-loyer" className={desktopLink} activeProps={desktopActive}>
            Saisie Prix Loyer
          </Link>
          <Link to="/contact" className={desktopLink} activeProps={desktopActive}>
            Contact
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-lg border border-border/60 bg-background hover:bg-muted transition-colors"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {open ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M6 18L18 6" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="md:hidden fixed inset-0 top-16 z-40 bg-foreground/40 backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className={`md:hidden fixed inset-x-0 top-16 z-50 origin-top border-t border-border/60 bg-background shadow-xl transition-all duration-200 ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
          <Link
            to="/"
            className={mobileLink}
            activeOptions={{ exact: true }}
            activeProps={mobileActive}
            onClick={close}
          >
            <span aria-hidden>🏠</span> Accueil
          </Link>
          <Link to="/logements" className={mobileLink} activeProps={mobileActive} onClick={close}>
            <span aria-hidden>🔑</span> Logements
          </Link>
          <Link to="/carte" className={mobileLink} activeProps={mobileActive} onClick={close}>
            <span aria-hidden>🗺️</span> Carte
          </Link>
          <Link
            to="/saisie-prix-loyer"
            className={mobileLink}
            activeProps={mobileActive}
            onClick={close}
          >
            <span aria-hidden>🔍</span> Saisie Prix Loyer
          </Link>
          <Link to="/contact" className={mobileLink} activeProps={mobileActive} onClick={close}>
            <span aria-hidden>💬</span> Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
