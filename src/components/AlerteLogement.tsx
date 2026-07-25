import { useId, useState } from "react";
import { formatFcfa, quartiers } from "@/data/listings";
import { libelleType, TYPES_ALERTE, type Alerte, type QuartierAlerte, type TypeAlerte } from "@/lib/alertes";
import type { NouvelleAlerte } from "@/hooks/use-alertes";

const champ =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

type Props = {
  alertes: Alerte[];
  onAjouter: (criteres: NouvelleAlerte) => void;
  onSupprimer: (id: string) => void;
};

export function AlerteSection({ alertes, onAjouter, onSupprimer }: Props) {
  const [ouvert, setOuvert] = useState(false);
  const [type, setType] = useState<TypeAlerte>("Studio");
  const [quartier, setQuartier] = useState<QuartierAlerte>(quartiers[0]);
  const [budget, setBudget] = useState("");
  const [erreur, setErreur] = useState("");
  const formId = useId();

  function activer(e: React.FormEvent) {
    e.preventDefault();
    const budgetMax = Number(budget);
    if (!Number.isFinite(budgetMax) || budgetMax <= 0) {
      setErreur("Indique un budget maximum en FCFA.");
      return;
    }
    setErreur("");
    onAjouter({ type, quartier, budgetMax });
    setBudget("");
    setOuvert(false);
  }

  return (
    <section className="mt-6">
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert}
        aria-controls={formId}
        className="btn-hover inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 font-semibold hover:scale-[1.02]"
      >
        🔔 Créer une alerte
      </button>

      {ouvert && (
        <form
          id={formId}
          onSubmit={activer}
          className="mt-4 rounded-2xl border border-border/60 bg-card p-5 sm:p-6 shadow-md fade-up"
        >
          <h2 className="text-lg font-bold text-foreground">Décris ce que tu cherches</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            On te signale les annonces correspondantes dès que tu ouvres la page.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-foreground">Type de logement</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TypeAlerte)}
                className={`mt-1.5 ${champ}`}
              >
                {TYPES_ALERTE.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground">Quartier</span>
              <select
                value={quartier}
                onChange={(e) => setQuartier(e.target.value as QuartierAlerte)}
                className={`mt-1.5 ${champ}`}
              >
                {quartiers.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground">Budget maximum (FCFA)</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                // step=1 : avec un pas de 5000 aligné sur min=1, le navigateur
                // refusait 50 000 ou 60 000 (seuls 5001, 10001… étaient valides).
                step={1}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Ex : 60000"
                className={`mt-1.5 ${champ}`}
              />
            </label>
          </div>

          {erreur && <p className="mt-3 text-sm font-medium text-destructive">{erreur}</p>}

          <button
            type="submit"
            className="btn-hover mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 font-semibold hover:scale-[1.02]"
          >
            Activer l'alerte
          </button>
        </form>
      )}

      {alertes.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Tes alertes :</span>
          {alertes.map((a) => (
            <span
              key={a.id}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
            >
              {libelleType(a.type)} · {a.quartier} · ≤ {formatFcfa(a.budgetMax)}
              <button
                type="button"
                onClick={() => onSupprimer(a.id)}
                aria-label={`Supprimer l'alerte ${libelleType(a.type)} à ${a.quartier}`}
                className="text-primary/70 hover:text-primary"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

export function BanniereAlertes({ nombre }: { nombre: number }) {
  if (nombre === 0) return null;

  return (
    <div
      role="status"
      className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-5 py-4 fade-up"
    >
      <span aria-hidden className="text-xl">
        🔔
      </span>
      <p className="font-semibold text-primary">
        {nombre} nouveau{nombre > 1 ? "x" : ""} logement{nombre > 1 ? "s" : ""} correspond
        {nombre > 1 ? "ent" : ""} à ton alerte
      </p>
    </div>
  );
}
