export type Listing = {
  id: number;
  type: "Studio" | "Chambre" | "Coloc";
  typeLabel: string;
  quartier:
    | "Fann"
    | "Point E"
    | "Mermoz"
    | "Fann Hock"
    | "Ouest-Foire"
    | "Médina"
    | "Sacré-Cœur"
    | "Liberté 6"
    | "Sicap Baobab"
    | "Dieuppeul"
    | "Grand Yoff"
    | "Parcelles Assainies";
  title: string;
  adresse: string;
  loyer: number;
  disponible: boolean;
  // "terrain" = visité par l'équipe ; "declaratif" = infos transmises par le proprio
  // sans visite. Le score de confiance ne crédite que "terrain".
  source: "terrain" | "declaratif";
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
    source: "terrain",
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
    source: "terrain",
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
    source: "terrain",
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
    source: "terrain",
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
    source: "terrain",
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
    source: "terrain",
    whatsapp: "https://wa.me/221791234570",
  },
  // Annonces déclaratives (transmises par les proprios, pas encore visitées).
  // Données fictives ajoutées pour éprouver les paliers orange et rouge du score.
  {
    id: 7,
    type: "Chambre",
    typeLabel: "Chambre meublée",
    quartier: "Mermoz",
    title: "Mermoz",
    adresse: "Rue ME-21, près du rond-point",
    loyer: 95000,
    disponible: true,
    source: "declaratif",
    whatsapp: "https://wa.me/221771234571",
  },
  {
    id: 8,
    type: "Studio",
    typeLabel: "Studio non meublé",
    quartier: "Ouest-Foire",
    title: "Ouest-Foire",
    adresse: "Cité Kalia, près de l'aéroport",
    loyer: 80000,
    disponible: true,
    source: "declaratif",
    whatsapp: "https://wa.me/221781234572",
  },
  {
    id: 9,
    type: "Chambre",
    typeLabel: "Chambre simple",
    quartier: "Médina",
    title: "Médina",
    adresse: "Rue 22 x Av. Blaise Diagne",
    loyer: 40000,
    disponible: false,
    source: "declaratif",
  },
  {
    id: 10,
    type: "Coloc",
    typeLabel: "Chambre en colocation",
    quartier: "Point E",
    title: "Point E",
    adresse: "Rue PE-05, près du terrain de basket",
    loyer: 55000,
    disponible: true,
    source: "declaratif",
    whatsapp: "https://wa.me/221761234573",
  },
  {
    id: 11,
    type: "Studio",
    typeLabel: "Studio meublé haut standing",
    quartier: "Point E",
    title: "Point E",
    adresse: "Av. Cheikh Anta Diop, résidence neuve",
    loyer: 110000,
    disponible: true,
    source: "declaratif",
    whatsapp: "https://wa.me/221791234575",
  },

  // ---------------------------------------------------------------------------
  // Jeu de démonstration : 30 annonces FICTIVES, calibrées sur les ordres de
  // grandeur du locatif étudiant à Dakar (quartiers, types de biens, loyers).
  // Adresses et numéros WhatsApp inventés — à remplacer par de vraies annonces
  // avant toute mise en ligne.
  // ---------------------------------------------------------------------------
  {
    id: 12,
    type: "Studio",
    typeLabel: "Studio meublé",
    quartier: "Fann",
    title: "Fann Résidence",
    adresse: "Rue FA-04, face à l'UCAD 2",
    loyer: 78000,
    disponible: true,
    source: "terrain",
    whatsapp: "https://wa.me/221771234576",
  },
  {
    id: 13,
    type: "Chambre",
    typeLabel: "Chambre simple",
    quartier: "Fann",
    title: "Fann Résidence",
    adresse: "Rue FA-17, cité Sipres",
    loyer: 42000,
    disponible: true,
    source: "declaratif",
    whatsapp: "https://wa.me/221781234577",
  },
  {
    id: 14,
    type: "Coloc",
    typeLabel: "Chambre en colocation",
    quartier: "Fann",
    title: "Fann Résidence",
    adresse: "Rue FA-33, près de la bibliothèque universitaire",
    loyer: 38000,
    disponible: false,
    source: "terrain",
  },
  {
    id: 15,
    type: "Studio",
    typeLabel: "Studio meublé",
    quartier: "Point E",
    title: "Point E",
    adresse: "Rue PE-08, près de la clinique",
    loyer: 88000,
    disponible: true,
    source: "terrain",
    whatsapp: "https://wa.me/221761234578",
  },
  {
    id: 16,
    type: "Chambre",
    typeLabel: "Chambre meublée",
    quartier: "Point E",
    title: "Point E",
    adresse: "Rue PE-21, immeuble en face de la pharmacie",
    loyer: 65000,
    disponible: true,
    source: "declaratif",
    whatsapp: "https://wa.me/221771234579",
  },
  {
    id: 17,
    type: "Coloc",
    typeLabel: "Chambre en colocation",
    quartier: "Point E",
    title: "Point E",
    adresse: "Av. Birago Diop, villa partagée",
    loyer: 50000,
    disponible: false,
    source: "terrain",
  },
  {
    id: 18,
    type: "Studio",
    typeLabel: "Studio non meublé",
    quartier: "Mermoz",
    title: "Mermoz",
    adresse: "Rue ME-14, près du lycée",
    loyer: 72000,
    disponible: true,
    source: "terrain",
    whatsapp: "https://wa.me/221781234580",
  },
  {
    id: 19,
    type: "Chambre",
    typeLabel: "Chambre meublée",
    quartier: "Mermoz",
    title: "Mermoz",
    adresse: "Rue ME-03, cité Assemblée",
    loyer: 60000,
    disponible: true,
    source: "declaratif",
    whatsapp: "https://wa.me/221791234581",
  },
  {
    id: 20,
    type: "Studio",
    typeLabel: "Studio meublé haut standing",
    quartier: "Mermoz",
    title: "Mermoz",
    adresse: "Mermoz Pyrotechnie, immeuble récent",
    loyer: 120000,
    disponible: true,
    source: "declaratif",
    whatsapp: "https://wa.me/221771234582",
  },
  {
    id: 21,
    type: "Chambre",
    typeLabel: "Chambre simple",
    quartier: "Fann Hock",
    title: "Fann Hock",
    adresse: "Rue FH-07, près du dispensaire",
    loyer: 32000,
    disponible: true,
    source: "terrain",
    whatsapp: "https://wa.me/221761234583",
  },
  {
    id: 22,
    type: "Coloc",
    typeLabel: "Chambre en colocation",
    quartier: "Fann Hock",
    title: "Fann Hock",
    adresse: "Rue FH-22, face au terrain de sport",
    loyer: 40000,
    disponible: true,
    source: "declaratif",
    whatsapp: "https://wa.me/221781234584",
  },
  {
    id: 23,
    type: "Studio",
    typeLabel: "Studio meublé",
    quartier: "Ouest-Foire",
    title: "Ouest-Foire",
    adresse: "Cité Ndiaga Sarr, près du marché",
    loyer: 95000,
    disponible: true,
    source: "declaratif",
    whatsapp: "https://wa.me/221791234585",
  },
  {
    id: 24,
    type: "Chambre",
    typeLabel: "Chambre meublée",
    quartier: "Ouest-Foire",
    title: "Ouest-Foire",
    adresse: "Route de l'aéroport, cité Sotrac",
    loyer: 55000,
    disponible: false,
    source: "terrain",
  },
  {
    id: 25,
    type: "Chambre",
    typeLabel: "Chambre simple",
    quartier: "Médina",
    title: "Médina",
    adresse: "Rue 11 x Av. Malick Sy",
    loyer: 35000,
    disponible: true,
    source: "terrain",
    whatsapp: "https://wa.me/221771234586",
  },
  {
    id: 26,
    type: "Coloc",
    typeLabel: "Chambre en colocation",
    quartier: "Médina",
    title: "Médina",
    adresse: "Rue 33, près du marché Tilène",
    loyer: 30000,
    disponible: true,
    source: "declaratif",
    whatsapp: "https://wa.me/221761234587",
  },
  {
    id: 27,
    type: "Studio",
    typeLabel: "Studio meublé",
    quartier: "Sacré-Cœur",
    title: "Sacré-Cœur",
    adresse: "Sacré-Cœur 3, près de la VDN",
    loyer: 115000,
    disponible: true,
    source: "terrain",
    whatsapp: "https://wa.me/221781234588",
  },
  {
    id: 28,
    type: "Chambre",
    typeLabel: "Chambre meublée",
    quartier: "Sacré-Cœur",
    title: "Sacré-Cœur",
    adresse: "Sacré-Cœur 1, près de la mosquée",
    loyer: 70000,
    disponible: true,
    source: "declaratif",
    whatsapp: "https://wa.me/221791234589",
  },
  {
    id: 29,
    type: "Studio",
    typeLabel: "Studio non meublé",
    quartier: "Sacré-Cœur",
    title: "Sacré-Cœur",
    adresse: "Sacré-Cœur 2, cité Keur Gorgui",
    loyer: 90000,
    disponible: false,
    source: "declaratif",
  },
  {
    id: 30,
    type: "Chambre",
    typeLabel: "Chambre meublée",
    quartier: "Liberté 6",
    title: "Liberté 6",
    adresse: "Liberté 6 extension, rue 12",
    loyer: 52000,
    disponible: true,
    source: "terrain",
    whatsapp: "https://wa.me/221771234590",
  },
  {
    id: 31,
    type: "Studio",
    typeLabel: "Studio non meublé",
    quartier: "Liberté 6",
    title: "Liberté 6",
    adresse: "Liberté 6, près du terrain municipal",
    loyer: 68000,
    disponible: true,
    source: "declaratif",
    whatsapp: "https://wa.me/221761234591",
  },
  {
    id: 32,
    type: "Coloc",
    typeLabel: "Chambre en colocation",
    quartier: "Liberté 6",
    title: "Liberté 6",
    adresse: "Liberté 6, villa proche du carrefour",
    loyer: 45000,
    disponible: true,
    source: "declaratif",
    whatsapp: "https://wa.me/221781234592",
  },
  {
    id: 33,
    type: "Chambre",
    typeLabel: "Chambre simple",
    quartier: "Sicap Baobab",
    title: "Sicap Baobab",
    adresse: "Sicap Baobab, rue 5, près de l'école",
    loyer: 38000,
    disponible: true,
    source: "terrain",
    whatsapp: "https://wa.me/221791234593",
  },
  {
    id: 34,
    type: "Studio",
    typeLabel: "Studio meublé",
    quartier: "Sicap Baobab",
    title: "Sicap Baobab",
    adresse: "Sicap Baobab, av. Bourguiba",
    loyer: 82000,
    disponible: true,
    source: "declaratif",
    whatsapp: "https://wa.me/221771234594",
  },
  {
    id: 35,
    type: "Chambre",
    typeLabel: "Chambre meublée",
    quartier: "Dieuppeul",
    title: "Dieuppeul",
    adresse: "Dieuppeul 2, près du terrain ASC",
    loyer: 48000,
    disponible: true,
    source: "terrain",
    whatsapp: "https://wa.me/221761234595",
  },
  {
    id: 36,
    type: "Studio",
    typeLabel: "Studio non meublé",
    quartier: "Dieuppeul",
    title: "Dieuppeul",
    adresse: "Dieuppeul 4, villa côté avenue",
    loyer: 65000,
    disponible: false,
    source: "declaratif",
  },
  {
    id: 37,
    type: "Chambre",
    typeLabel: "Chambre simple",
    quartier: "Grand Yoff",
    title: "Grand Yoff",
    adresse: "Grand Yoff, cité Millionnaire",
    loyer: 30000,
    disponible: true,
    source: "declaratif",
    whatsapp: "https://wa.me/221781234596",
  },
  {
    id: 38,
    type: "Coloc",
    typeLabel: "Chambre en colocation",
    quartier: "Grand Yoff",
    title: "Grand Yoff",
    adresse: "Grand Yoff, près du marché",
    loyer: 28000,
    disponible: true,
    source: "terrain",
    whatsapp: "https://wa.me/221791234597",
  },
  {
    id: 39,
    type: "Chambre",
    typeLabel: "Chambre simple",
    quartier: "Parcelles Assainies",
    title: "Parcelles Assainies",
    adresse: "Unité 15, près du terminus",
    loyer: 27000,
    disponible: true,
    source: "terrain",
    whatsapp: "https://wa.me/221771234598",
  },
  {
    id: 40,
    type: "Studio",
    typeLabel: "Studio non meublé",
    quartier: "Parcelles Assainies",
    title: "Parcelles Assainies",
    adresse: "Unité 22, villa côté rue principale",
    loyer: 55000,
    disponible: true,
    source: "declaratif",
    whatsapp: "https://wa.me/221761234599",
  },
  {
    id: 41,
    type: "Chambre",
    typeLabel: "Chambre meublée",
    quartier: "Parcelles Assainies",
    title: "Parcelles Assainies",
    adresse: "Unité 8, près du marché",
    loyer: 45000,
    disponible: false,
    source: "declaratif",
  },
];

// Quartiers réellement présents dans les annonces, triés alphabétiquement.
// Les filtres de la page Logements en dérivent : impossible d'en oublier un.
export const quartiers = [...new Set(listings.map((l) => l.quartier))].sort((a, b) =>
  a.localeCompare(b, "fr"),
);

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

// Score de confiance sur 100 : 10 points de base, +25 si disponible, +25 si le loyer
// est dans ou sous la fourchette du quartier, +40 si l'annonce vient d'une visite terrain.
// La visite terrain pèse le plus lourd : une annonce déclarative plafonne à 60.
export type TrustCriterion = { label: string; points: number; acquis: boolean };
export type TrustScore = { score: number; criteres: TrustCriterion[] };

export const getTrustScore = (l: Listing): TrustScore => {
  const criteres: TrustCriterion[] = [
    { label: "Base", points: 10, acquis: true },
    { label: "Logement disponible", points: 25, acquis: l.disponible },
    {
      label: "Loyer dans ou sous la fourchette du quartier",
      points: 25,
      acquis: getPriceLevel(l) !== "eleve",
    },
    { label: "Vérifié sur le terrain", points: 40, acquis: l.source === "terrain" },
  ];

  const score = criteres.reduce((total, c) => total + (c.acquis ? c.points : 0), 0);
  return { score, criteres };
};
