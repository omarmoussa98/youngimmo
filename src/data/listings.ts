export type Listing = {
  id: number;
  type: "Studio" | "Chambre" | "Coloc";
  typeLabel: string;
  quartier: "Fann" | "Point E" | "Mermoz" | "Fann Hock";
  title: string;
  adresse: string;
  loyer: number;
  disponible: boolean;
  whatsapp?: string;
};

export const listings: Listing[] = [
  {
    id: 1,
    type: "Studio",
    typeLabel: "Studio meublé",
    quartier: "Fann",
    title: "Fann Résidence",
    adresse: "Rue FA-10, près du marché",
    loyer: 70000,
    disponible: true,
    whatsapp: "https://wa.me/221791234574",
  },
  {
    id: 2,
    type: "Chambre",
    typeLabel: "Chambre meublée",
    quartier: "Fann",
    title: "Fann Résidence",
    adresse: "Rue FA-29, près de la mosquée",
    loyer: 45000,
    disponible: true,
    whatsapp: "https://wa.me/221781234568",
  },
  {
    id: 3,
    type: "Studio",
    typeLabel: "Studio meublé",
    quartier: "Mermoz",
    title: "Mermoz",
    adresse: "Rue ME-08, près de la boulangerie",
    loyer: 85000,
    disponible: false,
  },
  {
    id: 4,
    type: "Studio",
    typeLabel: "Studio non meublé",
    quartier: "Point E",
    title: "Point E",
    adresse: "Av. Cheikh Anta Diop, côté supermarché",
    loyer: 60000,
    disponible: true,
    whatsapp: "https://wa.me/221761234569",
  },
  {
    id: 5,
    type: "Studio",
    typeLabel: "Studio meublé",
    quartier: "Point E",
    title: "Point E",
    adresse: "Rue PE-12, près de la pharmacie",
    loyer: 75000,
    disponible: true,
    whatsapp: "https://wa.me/221771234567",
  },
  {
    id: 6,
    type: "Coloc",
    typeLabel: "Chambre en colocation",
    quartier: "Fann Hock",
    title: "Fann Hock",
    adresse: "Rue FH-15, derrière la station Total",
    loyer: 35000,
    disponible: true,
    whatsapp: "https://wa.me/221791234570",
  },
];

export const formatFcfa = (n: number) => n.toLocaleString("fr-FR") + " FCFA";

// Fourchette de marché par quartier, déduite des loyers des annonces elles-mêmes :
// moyenne du quartier ±10 %. Un quartier qui n'a qu'une annonce reste donc "dans
// la fourchette" au lieu d'être classé arbitrairement.
const TOLERANCE = 0.1;

export type PriceRange = { min: number; max: number; moyenne: number };

export const quartierPriceRanges = (() => {
  const loyersParQuartier = new Map<Listing["quartier"], number[]>();
  for (const l of listings) {
    const loyers = loyersParQuartier.get(l.quartier) ?? [];
    loyers.push(l.loyer);
    loyersParQuartier.set(l.quartier, loyers);
  }

  const ranges = {} as Record<Listing["quartier"], PriceRange>;
  for (const [quartier, loyers] of loyersParQuartier) {
    const moyenne = loyers.reduce((total, loyer) => total + loyer, 0) / loyers.length;
    ranges[quartier] = {
      moyenne,
      min: Math.round(moyenne * (1 - TOLERANCE)),
      max: Math.round(moyenne * (1 + TOLERANCE)),
    };
  }
  return ranges;
})();

export type PriceLevel = "bon" | "normal" | "eleve";

export const getPriceLevel = (l: Listing): PriceLevel => {
  const range = quartierPriceRanges[l.quartier];
  if (!range) return "normal";
  if (l.loyer < range.min) return "bon";
  if (l.loyer > range.max) return "eleve";
  return "normal";
};
