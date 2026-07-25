import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { YiHeader } from "@/components/YiHeader";
import { YiFooter } from "@/components/YiFooter";
import { listings, quartiers } from "@/data/listings";
import { AiAssistant } from "@/components/AiAssistant";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AlerteSection, BanniereAlertes } from "@/components/AlerteLogement";
import { ListingCard } from "@/components/ListingCard";
import { useAlertes } from "@/hooks/use-alertes";
import { trouverAlerte } from "@/lib/alertes";

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
