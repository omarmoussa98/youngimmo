import { useState } from "react";
import { appelerDify } from "@/lib/dify";

type Status = "idle" | "loading" | "success" | "error";

export function AiAssistant() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || status === "loading") return;

    setStatus("loading");
    setError("");
    setResult("");

    const resultat = await appelerDify({ query });

    if (resultat.ok) {
      setResult(resultat.texte);
      setStatus("success");
    } else {
      setError(resultat.erreur);
      setStatus("error");
    }
  }

  return (
    <section className="mt-16">
      <div className="rounded-2xl bg-card border border-border/60 shadow-md p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Tu ne trouves pas ton bonheur ? 🤖 Demande à l'assistant IA
        </h2>
        <p className="mt-2 text-muted-foreground">
          Décris ton besoin en une phrase, l'assistant cherche dans nos annonces vérifiées.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex : Je cherche un studio à Fann pour moins de 80 000 FCFA..."
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={status === "loading" || !query.trim()}
            className="btn-hover inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 font-semibold hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            🤖 Demander à l'assistant YoungImmo
          </button>
        </form>

        {status === "loading" && (
          <div className="mt-6 flex items-center gap-3 text-muted-foreground">
            <span
              className="inline-block w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"
              aria-hidden
            />
            <span>Recherche dans les annonces vérifiées...</span>
          </div>
        )}

        {status === "error" && (
          <div className="mt-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-destructive font-medium">
            {error}
          </div>
        )}

        {status === "success" && result && (
          <div
            className="mt-6 text-sm text-foreground break-words fade-up"
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              background: "#FFFFFF",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              lineHeight: "1.6",
            }}
          >
            {result}
          </div>
        )}
      </div>
    </section>
  );
}
