// Appel de l'agent Dify — même endpoint, même clé et même structure de requête
// que src/components/AiAssistant.tsx, extraits ici pour être réutilisés.
const DIFY_URL = "https://api.dify.ai/v1/workflows/run";
const DIFY_TOKEN = "app-aXRj5fB3wYpDnKgN52YbauGB";
const TIMEOUT_MS = 10_000;

export type DifyResultat = { ok: true; texte: string } | { ok: false; erreur: string };

export async function appelerDify(
  inputs: Record<string, string>,
  // `user` identifie l'appelant côté Dify : l'outil interne de saisie s'annonce
  // comme "equipe-terrain", le site public utilise un identifiant anonyme.
  options?: { user?: string },
): Promise<DifyResultat> {
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
        inputs,
        response_mode: "blocking",
        user: options?.user ?? "youngimmo-" + Date.now(),
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error("http_" + res.status);
    const json = await res.json();
    const rawOutput = json?.data?.outputs;
    const texte =
      rawOutput?.text ||
      (typeof rawOutput === "string" ? rawOutput : "") ||
      json?.data?.answer ||
      // Sortie structurée sans champ `text` : on montre le JSON brut plutôt que
      // de perdre la réponse (utile à l'équipe pour déboguer le workflow).
      (rawOutput ? JSON.stringify(rawOutput, null, 2) : "") ||
      "Aucune réponse reçue.";
    return { ok: true, texte };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const isAbort =
      (err instanceof DOMException && err.name === "AbortError") ||
      (err as { name?: string })?.name === "AbortError";
    return {
      ok: false,
      erreur: isAbort
        ? "La réponse prend trop de temps — réessaye dans quelques secondes"
        : "Service temporairement indisponible — vérifie ta connexion",
    };
  }
}
