import { useState } from "react";
import { formatFcfa, getPriceLevel, quartierPriceRanges, type Listing } from "@/data/listings";
import { appelerDify } from "@/lib/dify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Status = "idle" | "loading" | "success" | "error";

// Le prompt donne à l'agent les deux leviers demandés : la position du loyer dans
// la fourchette du quartier, et la disponibilité du bien.
function construirePrompt(l: Listing) {
  const range = quartierPriceRanges[l.quartier];
  const niveau = getPriceLevel(l);
  const position =
    niveau === "bon"
      ? "en dessous de la fourchette du quartier"
      : niveau === "eleve"
        ? "au-dessus de la fourchette du quartier"
        : "dans la fourchette du quartier";
  const ecart = Math.round(((l.loyer - range.moyenne) / range.moyenne) * 100);

  return [
    "Tu aides un étudiant à négocier le loyer d'un logement à Dakar.",
    "Donne 2 ou 3 arguments de négociation courts, concrets et polis, en français.",
    "",
    `Logement : ${l.typeLabel} à ${l.quartier} (${l.adresse})`,
    `Loyer demandé : ${formatFcfa(l.loyer)} par mois`,
    `Fourchette du quartier : ${formatFcfa(range.min)} à ${formatFcfa(range.max)}, moyenne ${formatFcfa(Math.round(range.moyenne))}`,
    `Position du prix : ${position} (${ecart >= 0 ? "+" : ""}${ecart} % par rapport à la moyenne du quartier)`,
    `Disponibilité : ${l.disponible ? "disponible immédiatement" : "actuellement loué"}`,
    "",
    "Réponds uniquement par 2 ou 3 puces commençant par un tiret, sans introduction.",
  ].join("\n");
}

// Les modèles répondent en puces "-", "•" ou "1." selon leur humeur : on les
// normalise pour un rendu en liste propre, et on retombe sur le texte brut si le
// format ne s'y prête pas.
const MARQUEUR = /^\s*(?:[-*•–—]|\d+[.)])\s+/;

function parserArguments(texte: string): string[] {
  const lignes = texte
    .split("\n")
    .map((ligne) => ligne.trim())
    .filter(Boolean);
  const puces = lignes
    .filter((ligne) => MARQUEUR.test(ligne))
    .map((ligne) => ligne.replace(MARQUEUR, "").trim())
    .filter(Boolean);
  return puces.length >= 2 ? puces : [];
}

export function AideNegociation({ l }: { l: Listing }) {
  const [ouvert, setOuvert] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [texte, setTexte] = useState("");
  const [erreur, setErreur] = useState("");
  const [copie, setCopie] = useState(false);

  const range = quartierPriceRanges[l.quartier];
  const niveau = getPriceLevel(l);
  const ecart = Math.round(((l.loyer - range.moyenne) / range.moyenne) * 100);
  const puces = parserArguments(texte);

  async function lancer() {
    setStatus("loading");
    setErreur("");
    setTexte("");

    const resultat = await appelerDify({ query: construirePrompt(l) });

    if (resultat.ok) {
      setTexte(resultat.texte);
      setStatus("success");
    } else {
      setErreur(resultat.erreur);
      setStatus("error");
    }
  }

  function ouvrir() {
    setOuvert(true);
    // Les arguments déjà obtenus sont conservés : rouvrir la fiche ne
    // reconsomme pas le quota Dify. Le bouton « Régénérer » force un appel.
    if (status === "idle") void lancer();
  }

  async function copier() {
    try {
      await navigator.clipboard.writeText(texte);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      setCopie(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={ouvrir}
        className="btn-hover mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background text-foreground px-4 py-2.5 font-semibold hover:border-primary/40"
      >
        🤝 Aide à la négociation
      </button>

      <Dialog open={ouvert} onOpenChange={setOuvert}>
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">🤝 Aide à la négociation</DialogTitle>
            <DialogDescription>
              {l.typeLabel} à {l.quartier} — {formatFcfa(l.loyer)}/mois
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                niveau === "bon"
                  ? "bg-success/10 text-success"
                  : niveau === "eleve"
                    ? "bg-accent/15 text-accent"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {ecart >= 0 ? "+" : ""}
              {ecart} % vs moyenne {l.quartier}
            </span>
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              Fourchette {formatFcfa(range.min)} – {formatFcfa(range.max)}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                l.disponible ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              }`}
            >
              {l.disponible ? "Disponible" : "Actuellement loué"}
            </span>
          </div>

          {status === "loading" && (
            <div className="flex items-center gap-3 py-4 text-muted-foreground">
              <span
                aria-hidden
                className="inline-block w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"
              />
              <span>L'assistant prépare tes arguments…</span>
            </div>
          )}

          {status === "error" && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3">
              <p className="text-sm font-medium text-destructive">{erreur}</p>
              <button
                type="button"
                onClick={() => void lancer()}
                className="btn-hover mt-3 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Réessayer
              </button>
            </div>
          )}

          {status === "success" && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 fade-up">
              {puces.length > 0 ? (
                <ol className="space-y-3">
                  {puces.map((argument, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-foreground">{argument}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {texte}
                </p>
              )}
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void copier()}
                className="btn-hover inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/40"
              >
                {copie ? "✅ Copié" : "📋 Copier"}
              </button>
              <button
                type="button"
                onClick={() => void lancer()}
                className="btn-hover inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/40"
              >
                🔄 Régénérer
              </button>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Arguments générés par l'assistant YoungImmo à partir des prix du quartier. À adapter à
            ta situation.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
