import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { YiHeader } from "@/components/YiHeader";
import { YiFooter } from "@/components/YiFooter";
import {
  listings,
  formatFcfa,
  getPriceLevel,
  getTrustScore,
  quartiers,
  quartierPriceRanges,
  type Listing,
  type PriceLevel,
} from "@/data/listings";
import { AiAssistant } from "@/components/AiAssistant";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlerteSection, BanniereAlertes } from "@/components/AlerteLogement";
import { AideNegociation } from "@/components/AideNegociation";
import { useAlertes } from "@/hooks/use-alertes";
import { lienWhatsappRecap, trouverAlerte } from "@/lib/alertes";

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

const PRIX_FILTER = "Moins de 50 000 FCFA";
const filters = ["Tous", ...quartiers, PRIX_FILTER];

function LogementsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("Tous");
  const { alertes, chargees, ajouter, supprimer } = useAlertes();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((l) => {
      if (q) {
        const hay = `${l.typeLabel} ${l.title} ${l.adresse} ${l.quartier}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filter === "Tous") return true;
      if (filter === PRIX_FILTER) return l.loyer < 50000;
      return l.quartier === filter || l.title === filter;
    });
  }, [query, filter]);

  // Les annonces correspondant à une alerte remontent en tête. Array.prototype.sort
  // étant stable, l'ordre d'origine est conservé à l'intérieur de chaque groupe.
  const { affichees, correspondances } = useMemo(() => {
    if (alertes.length === 0) {
      return { affichees: results, correspondances: new Set<number>() };
    }
    const correspondances = new Set(
      results.filter((l) => trouverAlerte(l, alertes) !== null).map((l) => l.id),
    );
    const affichees = [...results].sort(
      (a, b) => Number(correspondances.has(b.id)) - Number(correspondances.has(a.id)),
    );
    return { affichees, correspondances };
  }, [results, alertes]);

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

        <AlerteSection alertes={alertes} onAjouter={ajouter} onSupprimer={supprimer} />
        {chargees && <BanniereAlertes nombre={correspondances.size} />}

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

        <TooltipProvider delayDuration={150}>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {affichees.map((l) => (
              <ListingCard key={l.id} l={l} correspond={correspondances.has(l.id)} />
            ))}
            {affichees.length === 0 && (
              <p className="text-muted-foreground col-span-full">
                Aucun logement ne correspond à ta recherche.
              </p>
            )}
          </div>
        </TooltipProvider>

        <AiAssistant />
      </main>
      <YiFooter />
    </div>
  );
}

function ListingCard({ l, correspond }: { l: Listing; correspond: boolean }) {
  return (
    <article
      className={`bg-card rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col fade-up border ${
        correspond ? "border-primary ring-2 ring-primary/30" : "border-border/60"
      }`}
    >
      <div className="p-5 flex-1 flex flex-col">
        {correspond && (
          <p className="mb-3 inline-flex items-center gap-1.5 self-start rounded-full bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1">
            🔔 Correspond à ton alerte
          </p>
        )}
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
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <PriceTag l={l} />
          <TrustBadge l={l} />
        </div>
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

          {correspond && (
            <a
              href={lienWhatsappRecap(l)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-primary text-primary px-4 py-2.5 font-semibold hover:bg-primary/10"
            >
              💬 Recevoir sur WhatsApp
            </a>
          )}

          <AideNegociation l={l} />
        </div>
      </div>
    </article>
  );
}

const priceTags: Record<PriceLevel, { label: string; className: string }> = {
  bon: { label: "Bon prix", className: "bg-success/10 text-success" },
  normal: { label: "Prix normal", className: "bg-muted text-muted-foreground" },
  eleve: { label: "Au-dessus du marché", className: "bg-accent/15 text-accent" },
};

function PriceTag({ l }: { l: Listing }) {
  const range = quartierPriceRanges[l.quartier];
  if (!range) return null;

  const { label, className } = priceTags[getPriceLevel(l)];
  return (
    <span
      title={`Fourchette ${l.quartier} : ${formatFcfa(range.min)} – ${formatFcfa(range.max)}`}
      className={`inline-flex items-center rounded-full text-xs font-semibold px-2.5 py-1 ${className}`}
    >
      {label}
    </span>
  );
}

function trustClassName(score: number) {
  if (score > 70) return "bg-success/10 text-success border-success/30";
  if (score >= 50) return "bg-accent/15 text-accent border-accent/40";
  return "bg-destructive/10 text-destructive border-destructive/30";
}

function TrustBadge({ l }: { l: Listing }) {
  const { score, criteres } = getTrustScore(l);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          tabIndex={0}
          className={`inline-flex items-center gap-1 rounded-full border text-xs font-semibold px-2.5 py-1 cursor-help focus:outline-none focus:ring-2 focus:ring-primary ${trustClassName(score)}`}
        >
          🛡️ Confiance {score}/100
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs bg-card text-foreground border border-border p-3 shadow-lg">
        <p className="font-semibold">Score de confiance : {score}/100</p>
        <ul className="mt-2 space-y-1">
          {criteres.map((c) => (
            <li
              key={c.label}
              className={`flex items-start gap-1.5 ${c.acquis ? "" : "text-muted-foreground"}`}
            >
              <span aria-hidden>{c.acquis ? "✅" : "❌"}</span>
              <span>
                {c.label} — {c.acquis ? `+${c.points}` : `0 sur ${c.points}`}
              </span>
            </li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
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
