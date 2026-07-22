import { useState } from "react";

const DIFY_URL = "https://api.dify.ai/v1/workflows/run";
const DIFY_TOKEN = "app-aXRj5fB3wYpDnKgN52YbauGB";
const TIMEOUT_MS = 10_000;

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
          inputs: { query },
          response_mode: "blocking",
          user: "youngimmo-" + Date.now(),
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error("http_" + res.status);
      const json = await res.json();
      const rawOutput = json?.data?.outputs;
      const text =
        rawOutput?.text ||
        (typeof rawOutput === "string" ? rawOutput : "") ||
        json?.data?.answer ||
        "Aucune réponse reçue.";
      setResult(text);
      setStatus("success");
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const isAbort =
        (err instanceof DOMException && err.name === "AbortError") ||
        (err as { name?: string })?.name === "AbortError";
      if (isAbort) {
        setError("La réponse prend trop de temps — réessaye dans quelques secondes");
      } else {
        setError("Service temporairement indisponible — vérifie ta connexion");
      }
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
