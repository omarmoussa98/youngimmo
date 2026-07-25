import { formatFcfa, type Listing } from "@/data/listings";

export type TypeAlerte = Listing["type"];
export type QuartierAlerte = Listing["quartier"];

// Libellés du menu déroulant. La valeur est le type stocké dans les annonces
// ("Coloc"), le libellé est ce que lit l'étudiant ("Colocation").
export const TYPES_ALERTE: { value: TypeAlerte; label: string }[] = [
  { value: "Studio", label: "Studio" },
  { value: "Chambre", label: "Chambre" },
  { value: "Coloc", label: "Colocation" },
  { value: "Appartement", label: "Appartement" },
];

export type Alerte = {
  id: string;
  type: TypeAlerte;
  quartier: QuartierAlerte;
  budgetMax: number;
  creeeLe: number;
};

const STORAGE_KEY = "youngimmo:alertes:v1";

const estAlerteValide = (valeur: unknown): valeur is Alerte => {
  if (typeof valeur !== "object" || valeur === null) return false;
  const a = valeur as Record<string, unknown>;
  return (
    typeof a.id === "string" &&
    typeof a.quartier === "string" &&
    typeof a.creeeLe === "number" &&
    typeof a.budgetMax === "number" &&
    Number.isFinite(a.budgetMax) &&
    a.budgetMax > 0 &&
    TYPES_ALERTE.some((t) => t.value === a.type)
  );
};

// Lecture tolérante : un localStorage indisponible (mode privé, cookies bloqués)
// ou un contenu corrompu ne doit jamais casser la page.
export const chargerAlertes = (): Alerte[] => {
  if (typeof window === "undefined") return [];
  try {
    const brut = window.localStorage.getItem(STORAGE_KEY);
    if (!brut) return [];
    const parse: unknown = JSON.parse(brut);
    return Array.isArray(parse) ? parse.filter(estAlerteValide) : [];
  } catch {
    return [];
  }
};

export const sauvegarderAlertes = (alertes: Alerte[]) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(alertes));
  } catch {
    // Quota dépassé ou stockage refusé : l'alerte reste active pour la session.
  }
};

export const creerId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

// Une annonce correspond si elle est encore disponible et coche les trois critères.
export const correspondAAlerte = (l: Listing, a: Alerte) =>
  l.disponible && l.type === a.type && l.quartier === a.quartier && l.loyer <= a.budgetMax;

export const trouverAlerte = (l: Listing, alertes: Alerte[]): Alerte | null =>
  alertes.find((a) => correspondAAlerte(l, a)) ?? null;

export const memeCriteres = (a: Alerte, b: Omit<Alerte, "id" | "creeeLe">) =>
  a.type === b.type && a.quartier === b.quartier && a.budgetMax === b.budgetMax;

export const libelleType = (type: TypeAlerte) =>
  TYPES_ALERTE.find((t) => t.value === type)?.label ?? type;

// Lien WhatsApp de partage : sans numéro, wa.me laisse l'étudiant choisir le
// destinataire (lui-même, un ami, un parent) avec le récapitulatif pré-rempli.
export const lienWhatsappRecap = (l: Listing) => {
  const message = [
    `🏠 ${l.typeLabel} — ${l.quartier}`,
    `💰 ${formatFcfa(l.loyer)}/mois`,
    `📍 ${l.adresse}`,
    "",
    "Trouvé via mon alerte YoungImmo — ton appart, pas d'arnaque.",
  ].join("\n");
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
};
