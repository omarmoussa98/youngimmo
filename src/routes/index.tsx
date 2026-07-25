import { createFileRoute, Link } from "@tanstack/react-router";
import { YiHeader } from "@/components/YiHeader";
import { YiFooter } from "@/components/YiFooter";
import { Search, BadgeCheck, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YoungImmo — Ton appart vérifié près du campus à Dakar" },
      {
        name: "description",
        content:
          "Trouve un logement étudiant vérifié à Dakar en 3 clics. Annonces vérifiées sur le terrain, prix affichés, contact proprio direct. Zéro commission.",
      },
      { property: "og:title", content: "YoungImmo — Ton appart vérifié près du campus à Dakar" },
      {
        property: "og:description",
        content:
          "Trouve un logement étudiant vérifié à Dakar en 3 clics. Annonces vérifiées sur le terrain, prix affichés, contact proprio direct. Zéro commission.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <YiHeader overlay />
      <main>
        {/* Hero plein écran : le visuel court d'un bord à l'autre et passe sous
            l'en-tête transparent. Le fond empile deux images — une photo
            /hero.jpg si elle est déposée dans public/, sinon le SVG livré. */}
        <section className="relative min-h-[92svh] flex items-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("/hero.jpg"), url("/hero-immo.svg")' }}
          />
          {/* Fondu vers le fond ivoire : le visuel se dissout dans la page. */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />

          <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-24 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white text-xs font-semibold px-3.5 py-1.5 mb-7 backdrop-blur-sm ring-1 ring-white/25 fade-up">
              🇸🇳 Dakar · Étudiants
            </div>
            <h1 className="font-display text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white max-w-4xl mx-auto fade-up">
              Ton appart vérifié, à deux pas du campus
            </h1>
            <p className="mt-6 text-base sm:text-xl text-white/90 max-w-2xl mx-auto fade-up">
              Annonces vérifiées sur le terrain. Prix affichés. Proprio direct. Zéro commission.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center fade-up">
              <Link
                to="/logements"
                className="btn-hover inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-7 py-3.5 font-semibold shadow-xl shadow-black/30 hover:scale-[1.03]"
              >
                🏠 Voir les logements dispo
              </Link>
              <a
                href="#assistant"
                className="btn-hover inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 text-white ring-1 ring-white/40 px-7 py-3.5 font-semibold backdrop-blur-sm hover:bg-white/20"
              >
                🤖 Demande à l'assistant IA
              </a>
            </div>

            {/* Chiffres clés directement sur le visuel */}
            <dl className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto fade-up">
              {[
                { valeur: "100%", label: "des annonces vérifiées sur place" },
                { valeur: "0 FCFA", label: "de commission pour l'étudiant" },
                { valeur: "30 s", label: "pour joindre le proprio" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md px-5 py-4"
                >
                  <dt className="font-display text-2xl font-semibold text-white">{s.valeur}</dt>
                  <dd className="mt-1 text-sm text-white/80">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Témoignage */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16">
          <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6 sm:p-8 fade-up">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-xl font-bold text-white">
                F
              </div>
              <div className="min-w-0">
                <p className="font-display text-xl text-foreground italic leading-relaxed">
                  « J'ai trouvé mon studio à Fann en 2 jours grâce à YoungImmo. Plus jamais les
                  groupes WhatsApp ! »
                </p>
                <p className="mt-3 text-sm font-semibold text-muted-foreground">
                  — Fatou, 24 ans, Master 1 UCAD
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-center text-foreground">
            Comment ça marche ?
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3 relative">
            {[
              { n: 1, icon: Search, title: "Tu cherches" },
              { n: 2, icon: BadgeCheck, title: "Tu vérifies" },
              { n: 3, icon: MessageCircle, title: "Tu contactes le proprio" },
            ].map((step) => (
              <div key={step.n} className="text-center fade-up">
                <div className="relative mx-auto w-20 h-20 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-lg shadow-primary/25">
                  <step.icon size={32} />
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground grid place-items-center text-sm font-bold border-4 border-background">
                    {step.n}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold text-lg text-foreground">{step.title}</h3>
              </div>
            ))}
          </div>
        </section>

        <section id="assistant" className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-accent p-8 text-center text-white shadow-xl">
            <h3 className="text-2xl font-bold">Besoin d'aide pour choisir ?</h3>
            <p className="mt-2 opacity-90">
              Notre assistant IA te propose le logement parfait selon ton budget.
            </p>
            <Link
              to="/logements"
              className="btn-hover mt-5 inline-flex rounded-xl bg-white text-primary px-6 py-3 font-semibold hover:scale-[1.03]"
            >
              🤖 Parler à l'assistant IA
            </Link>
          </div>
        </section>
      </main>
      <YiFooter />
    </div>
  );
}
