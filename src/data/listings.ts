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
