import {
  formatFcfa,
  getPriceLevel,
  getTrustScore,
  quartierPriceRanges,
  type Listing,
  type PriceLevel,
} from "@/data/listings";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AideNegociation } from "@/components/AideNegociation";
import { lienWhatsappRecap } from "@/lib/alertes";

/**
 * Fiche d'annonce partagée par la page Logements et la page Carte.
 *
 * `TrustBadge` s'appuie sur un Tooltip Radix : l'arbre parent doit fournir un
 * `TooltipProvider`.
 */
export function ListingCard({ l, correspond = false }: { l: Listing; correspond?: boolean }) {
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

export function PriceTag({ l }: { l: Listing }) {
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

export function TrustBadge({ l }: { l: Listing }) {
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

export function StatusPill({ available }: { available: boolean }) {
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
