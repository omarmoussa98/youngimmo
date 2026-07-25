import { useCallback, useEffect, useState } from "react";
import {
  chargerAlertes,
  creerId,
  memeCriteres,
  sauvegarderAlertes,
  type Alerte,
} from "@/lib/alertes";

export type NouvelleAlerte = Omit<Alerte, "id" | "creeeLe">;

/**
 * Alertes logement persistées dans le localStorage du navigateur.
 *
 * La lecture se fait après le montage : le serveur n'a pas accès au
 * localStorage, lire pendant le rendu provoquerait un écart d'hydratation.
 * `chargees` permet donc de n'afficher la bannière qu'une fois l'état réel connu.
 */
export function useAlertes() {
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [chargees, setChargees] = useState(false);

  useEffect(() => {
    setAlertes(chargerAlertes());
    setChargees(true);
  }, []);

  // Les mutations écrivent explicitement dans le storage plutôt que via un effet
  // sur `alertes` : un effet se déclencherait aussi au montage et écraserait les
  // alertes existantes avec le tableau vide initial.
  const remplacer = useCallback((suivantes: Alerte[]) => {
    setAlertes(suivantes);
    sauvegarderAlertes(suivantes);
  }, []);

  const ajouter = useCallback(
    (criteres: NouvelleAlerte) => {
      setAlertes((actuelles) => {
        // Recréer une alerte identique ne sert à rien : on garde l'existante.
        if (actuelles.some((a) => memeCriteres(a, criteres))) return actuelles;
        const suivantes = [...actuelles, { ...criteres, id: creerId(), creeeLe: Date.now() }];
        sauvegarderAlertes(suivantes);
        return suivantes;
      });
    },
    [],
  );

  const supprimer = useCallback((id: string) => {
    setAlertes((actuelles) => {
      const suivantes = actuelles.filter((a) => a.id !== id);
      sauvegarderAlertes(suivantes);
      return suivantes;
    });
  }, []);

  return { alertes, chargees, ajouter, supprimer, remplacer };
}
