import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { YiHeader } from "@/components/YiHeader";
import { YiFooter } from "@/components/YiFooter";

const DIFY_URL = "https://api.dify.ai/v1/workflows/run";
const DIFY_TOKEN = "app-aXRj5fB3wYpDnKgN52YbauGB";
const TIMEOUT_MS = 10_000;

type Status = "idle" | "loading" | "success" | "error";

export const Route = createFileRoute("/saisie-prix-loyer")({
  head: () => ({
    meta: [
      { title: "Saisie Prix Loyer — YoungImmo Dakar" },
      {
        name: "description",
        content:
          "Outil interne de saisie des prix de loyer pour l'équipe de vérification YoungImmo. Génère une fiche logement depuis une annonce vérifiée sur place.",
      },
      { property: "og:title", content: "Saisie Prix Loyer — YoungImmo Dakar" },
      {
        property: "og:description",
        content:
          "Outil interne de saisie des prix de loyer pour l'équipe de vérification YoungImmo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SaisiePrixLoyerPage,
});

function SaisiePrixLoyerPage() {
  const [donnees, setDonnees] = useState("");
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [resultat, setResultat] = useState("");
  const [erreur, setErreur] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setErreur("");
    setResultat("");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort("timeout"), TIMEOUT_MS);

    try {
      const res = await fetch(DIFY_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${DIFY_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: { query: question, prix_loyer: donnees },
          response_mode: "blocking",
          user: "equipe-terrain",
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error("http_" + res.status);
      const json = await res.json();
      const text = json?.data?.outputs?.text || json?.data?.outputs || json?.data?.answer || "";
      setResultat(typeof text === "string" ? text : JSON.stringify(text));
      setStatus("success");
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const isAbort =
        (err instanceof DOMException && err.name === "AbortError") ||
        (err as { name?: string })?.name === "AbortError";
      setErreur(isAbort ? "La requête a pris trop de temps — réessaye." : "Erreur — réessayer");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <YiHeader />
      <main className="pt-24 pb-16 max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary">
          🔍 Saisie Prix Loyer
        </h1>
        <p className="mt-2 text-muted-foreground">
          Équipe de vérification YoungImmo — Données en temps réel
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-card rounded-2xl p-6 sm:p-8 shadow-md border border-border/60 space-y-5"
        >
          <div>
            <label
              htmlFor="donnees"
              className="block text-sm font-semibold text-foreground mb-1"
            >
              Annonce vérifiée sur place
            </label>
            <textarea
              id="donnees"
              name="donnees"
              rows={6}
              value={donnees}
              onChange={(e) => setDonnees(e.target.value)}
              placeholder="Ex: Point E 22/07/2026 14h30 — Studio meublé : 75000 FCFA/mois, disponible immédiatement"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div>
            <label
              htmlFor="question"
              className="block text-sm font-semibold text-foreground mb-1"
            >
              Votre question
            </label>
            <input
              id="question"
              name="question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex: Quels studios sont disponibles au Point E sous 80000 FCFA ?"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-hover w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 font-semibold hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            🤖 Générer la fiche logement
          </button>
        </form>

        {status === "loading" && (
          <div className="mt-6 flex items-center gap-3 text-muted-foreground">
            <span
              className="inline-block w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"
              aria-hidden
            />
            <span>⏳ Recherche dans les annonces vérifiées...</span>
          </div>
        )}

        {status === "error" && (
          <div className="mt-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-destructive font-medium">
            ❌ {erreur}
          </div>
        )}

        {status === "success" && resultat && (
          <div className="mt-6 fade-up">
            <h2 className="text-lg font-bold text-foreground mb-2">
              Fiche logement générée
            </h2>
            <div
              className="rounded-2xl border border-border/60 bg-white p-6 text-foreground shadow-md"
              style={{ whiteSpace: "pre-line", lineHeight: 1.6 }}
            >
              {resultat}
            </div>
          </div>
        )}
      </main>
      <YiFooter />
    </div>
  );
}
