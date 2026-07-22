import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { YiHeader } from "@/components/YiHeader";
import { YiFooter } from "@/components/YiFooter";
import { listings, formatFcfa, type Listing } from "@/data/listings";
import { AiAssistant } from "@/components/AiAssistant";

export const Route = createFileRoute("/logements")({
  head: () => ({
    meta: [
      { title: "Logements vérifiés à Dakar — YoungImmo" },
      {
        name: "description",
        content:
          "Studios, chambres et colocations vérifiés à Fann, Point E, Mermoz et Fann Hock. Contact proprio direct via WhatsApp, zéro commission.",
      },
      { property: "og:title", content: "Logements vérifiés à Dakar — YoungImmo" },
      {
        property: "og:description",
        content: "Studios, chambres et colocs vérifiés près des campus de Dakar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LogementsPage,
});

const filters = ["Tous", "Fann", "Point E", "Mermoz", "Moins de 50 000 FCFA"] as const;
type Filter = (typeof filters)[number];

function LogementsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("Tous");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((l) => {
      if (q) {
        const hay = `${l.typeLabel} ${l.title} ${l.adresse} ${l.quartier}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filter === "Tous") return true;
      if (filter === "Moins de 50 000 FCFA") return l.loyer < 50000;
      return l.quartier === filter || l.title === filter;
    });
  }, [query, filter]);

  return (
    <div className="min-h-screen bg-background">
      <YiHeader />
      <main className="pt-24 pb-16 max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
          Les logements vérifiés par l'équipe YoungImmo 🏠
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tous visités sur le terrain par notre équipe étudiante.
        </p>

        <div className="mt-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex : studio Fann, chambre Point E…"
            className="w-full rounded-xl border border-input bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn-hover px-4 py-2 rounded-full text-sm font-medium border ${
                filter === f
                  ? "bg-primary text-primary-foreground border-primary shadow"
                  : "bg-card text-foreground border-border hover:border-primary/40"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((l) => (
            <ListingCard key={l.id} l={l} />
          ))}
          {results.length === 0 && (
            <p className="text-muted-foreground col-span-full">
              Aucun logement ne correspond à ta recherche.
            </p>
          )}
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-r from-primary to-accent p-6 sm:p-8 text-center text-white shadow-xl">
          <p className="text-lg font-semibold">
            Tu ne trouves pas ton bonheur ? Parle à notre assistant IA 🤖
          </p>
          <button className="btn-hover mt-4 inline-flex rounded-xl bg-white text-primary px-6 py-3 font-semibold hover:scale-[1.03]">
            Ouvrir l'assistant IA
          </button>
        </div>
      </main>
      <YiFooter />
    </div>
  );
}

function ListingCard({ l }: { l: Listing }) {
  return (
    <article className="bg-card rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-border/60 overflow-hidden flex flex-col fade-up">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1">
            {l.typeLabel}
          </span>
          <StatusPill available={l.disponible} />
        </div>
        <h3 className="mt-3 text-lg font-bold text-foreground">{l.title}</h3>
        <p className="text-sm text-muted-foreground">{l.adresse}</p>
        <p className="mt-4 text-2xl font-extrabold text-accent">
          {formatFcfa(l.loyer)}
          <span className="text-sm font-medium text-muted-foreground">/mois</span>
        </p>
        <div className="mt-5 pt-4 border-t border-border/60">
          {l.disponible && l.whatsapp ? (
            <a
              href={l.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 font-semibold hover:scale-[1.02]"
            >
              📱 Contacter le proprio via WhatsApp
            </a>
          ) : (
            <button
              disabled
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-muted text-muted-foreground px-4 py-2.5 font-semibold cursor-not-allowed"
            >
              Actuellement loué
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function StatusPill({ available }: { available: boolean }) {
  if (available) {
    return (
      <span className="inline-flex items-center gap-2 text-xs font-semibold text-[color:var(--success)]">
        <span className="w-2.5 h-2.5 rounded-full bg-[color:var(--success)] pulse-dot" />
        Disponible
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold text-destructive">
      <span className="w-2.5 h-2.5 rounded-full bg-destructive" />
      Loué
    </span>
  );
}
