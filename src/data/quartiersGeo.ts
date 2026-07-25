import { listings, quartierPriceRanges, quartiers, type Listing } from "./listings";

export type Quartier = Listing["quartier"];

// Coordonnées APPROXIMATIVES du centre de chaque quartier (presqu'île de Dakar).
// Ce sont des points de repère pour situer les annonces sur la carte, pas des
// limites administratives. Le type Record force l'exhaustivité : ajouter un
// quartier dans listings.ts sans le placer ici casse la compilation.
export const quartierCoords: Record<Quartier, [number, number]> = {
  Fann: [14.6875, -17.4655],
  "Fann Hock": [14.674, -17.4525],
  "Point E": [14.6905, -17.459],
  Mermoz: [14.7045, -17.4735],
  "Ouest-Foire": [14.7455, -17.477],
  Médina: [14.6805, -17.446],
  "Sacré-Cœur": [14.7115, -17.462],
  "Liberté 6": [14.7175, -17.4565],
  "Sicap Baobab": [14.701, -17.457],
  Dieuppeul: [14.709, -17.4495],
  "Grand Yoff": [14.7345, -17.462],
  "Parcelles Assainies": [14.761, -17.431],
};

export type QuartierStats = {
  quartier: Quartier;
  coords: [number, number];
  moyenne: number;
  total: number;
  disponibles: number;
  minLoyer: number;
  maxLoyer: number;
};

// Un enregistrement par quartier, du moins cher au plus cher.
export const quartierStats: QuartierStats[] = quartiers
  .map((quartier) => {
    const annonces = listings.filter((l) => l.quartier === quartier);
    const loyers = annonces.map((l) => l.loyer);
    return {
      quartier,
      coords: quartierCoords[quartier],
      moyenne: quartierPriceRanges[quartier].moyenne,
      total: annonces.length,
      disponibles: annonces.filter((l) => l.disponible).length,
      minLoyer: Math.min(...loyers),
      maxLoyer: Math.max(...loyers),
    };
  })
  .sort((a, b) => a.moyenne - b.moyenne);

// Bornes de l'échelle de couleurs : moyenne la plus basse et la plus haute.
export const moyenneExtent = {
  min: quartierStats[0]?.moyenne ?? 0,
  max: quartierStats[quartierStats.length - 1]?.moyenne ?? 0,
};

// Dégradé vert (quartier le moins cher) → rouge (le plus cher), interpolé sur la
// teinte HSL. 140° = vert, 0° = rouge.
export const priceColor = (moyenne: number) => {
  const { min, max } = moyenneExtent;
  const ratio = max === min ? 0.5 : (moyenne - min) / (max - min);
  return `hsl(${Math.round(140 - ratio * 140)} 72% 42%)`;
};

// Centre et zoom cadrant tous les quartiers affichés.
export const mapCenter: [number, number] = [
  quartierStats.reduce((t, s) => t + s.coords[0], 0) / (quartierStats.length || 1),
  quartierStats.reduce((t, s) => t + s.coords[1], 0) / (quartierStats.length || 1),
];
