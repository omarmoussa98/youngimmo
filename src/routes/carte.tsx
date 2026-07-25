import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import leafletCss from "leaflet/dist/leaflet.css?url";
import { YiHeader } from "@/components/YiHeader";
import { YiFooter } from "@/components/YiFooter";
import { formatFcfa } from "@/data/listings";
import {
  mapCenter,
  moyenneExtent,
  priceColor,
  quartierStats,
  type QuartierStats,
} from "@/data/quartiersGeo";

export const Route = createFileRoute("/carte")({
  head: () => ({
    meta: [
      { title: "Carte des loyers étudiants à Dakar — YoungImmo" },
      {
        name: "description",
        content:
          "Visualise le prix moyen des loyers par quartier à Dakar : Fann, Point E, Mermoz, Médina, Sacré-Cœur, Parcelles Assainies et plus. Vert = abordable, rouge = cher.",
      },
      { property: "og:title", content: "Carte des loyers étudiants à Dakar — YoungImmo" },
      {
        property: "og:description",
        content: "Le prix moyen des loyers étudiants, quartier par quartier, sur une carte.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: leafletCss }],
  }),
  component: CartePage,
});

function CartePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [selected, setSelected] = useState<QuartierStats | null>(null);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    let annule = false;

    (async () => {
      try {
        // Leaflet touche à `window` dès l'import : on ne le charge que côté client,
        // sinon le rendu serveur plante.
        const L = await import("leaflet");
        if (annule || !containerRef.current) return;

        const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView(mapCenter, 12);
        mapRef.current = map;

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        for (const stats of quartierStats) {
          L.circleMarker(stats.coords, {
            // Le rayon traduit le nombre d'annonces, la couleur le prix moyen.
            radius: 10 + stats.total * 1.8,
            color: "#ffffff",
            weight: 2,
            fillColor: priceColor(stats.moyenne),
            fillOpacity: 0.85,
          })
            .addTo(map)
            .bindTooltip(`${stats.quartier} — ${formatFcfa(Math.round(stats.moyenne))} en moyenne`)
            .on("click", () => setSelected(stats));
        }

        if (quartierStats.length > 0) {
          map.fitBounds(L.latLngBounds(quartierStats.map((s) => s.coords)), { padding: [40, 40] });
        }
      } catch {
        if (!annule) setErreur(true);
      }
    })();

    return () => {
      annule = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const focus = (stats: QuartierStats) => {
    setSelected(stats);
    mapRef.current?.setView(stats.coords, 14, { animate: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <YiHeader />
      <main className="pt-24 pb-16 max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
          La carte des loyers à Dakar 🗺️
        </h1>
        <p className="mt-2 text-muted-foreground">
          Chaque cercle est un quartier où YoungImmo a des annonces. Sa couleur indique le loyer
          moyen, sa taille le nombre d'annonces. Clique dessus pour le détail.
        </p>

        <Legende />

        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="relative">
            <div
              ref={containerRef}
              className="h-[420px] sm:h-[520px] w-full rounded-2xl border border-border/60 shadow-md overflow-hidden bg-muted z-0"
              aria-label="Carte des quartiers de Dakar couverts par YoungImmo"
            />
            {erreur && (
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-muted p-6 text-center">
                <p className="text-muted-foreground">
                  La carte n'a pas pu se charger. La liste des quartiers ci-dessous reste
                  utilisable.
                </p>
              </div>
            )}
          </div>

          <DetailPanel stats={selected} />
        </div>

        <h2 className="mt-10 text-xl font-bold text-foreground">
          Tous les quartiers, du moins cher au plus cher
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {quartierStats.map((stats) => (
            <button
              key={stats.quartier}
              onClick={() => focus(stats)}
              aria-pressed={selected?.quartier === stats.quartier}
              className={`btn-hover inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                selected?.quartier === stats.quartier
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
            >
              <span
                aria-hidden
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: priceColor(stats.moyenne) }}
              />
              {stats.quartier}
              <span className="text-muted-foreground">{formatFcfa(Math.round(stats.moyenne))}</span>
            </button>
          ))}
        </div>
      </main>
      <YiFooter />
    </div>
  );
}

function Legende() {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
      <span className="text-muted-foreground">Loyer moyen du quartier :</span>
      <span className="font-semibold text-foreground">
        {formatFcfa(Math.round(moyenneExtent.min))}
      </span>
      <span
        aria-hidden
        className="h-2.5 w-40 rounded-full"
        style={{
          background: `linear-gradient(to right, ${priceColor(moyenneExtent.min)}, ${priceColor((moyenneExtent.min + moyenneExtent.max) / 2)}, ${priceColor(moyenneExtent.max)})`,
        }}
      />
      <span className="font-semibold text-foreground">
        {formatFcfa(Math.round(moyenneExtent.max))}
      </span>
    </div>
  );
}

function DetailPanel({ stats }: { stats: QuartierStats | null }) {
  if (!stats) {
    return (
      <aside className="rounded-2xl border border-border/60 bg-card p-6 shadow-md">
        <p className="text-muted-foreground">
          Clique sur un quartier de la carte pour voir son loyer moyen et le nombre d'annonces
          encore disponibles.
        </p>
      </aside>
    );
  }

  return (
    <aside className="rounded-2xl border border-border/60 bg-card p-6 shadow-md fade-up">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="w-4 h-4 rounded-full shrink-0"
          style={{ background: priceColor(stats.moyenne) }}
        />
        <h2 className="text-xl font-bold text-foreground">{stats.quartier}</h2>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">Loyer moyen</p>
      <p className="text-3xl font-extrabold text-accent">
        {formatFcfa(Math.round(stats.moyenne))}
        <span className="text-sm font-medium text-muted-foreground">/mois</span>
      </p>

      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Annonces disponibles</dt>
          <dd className="font-semibold text-foreground">
            {stats.disponibles} sur {stats.total}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Loyers constatés</dt>
          <dd className="font-semibold text-foreground">
            {formatFcfa(stats.minLoyer)} – {formatFcfa(stats.maxLoyer)}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
