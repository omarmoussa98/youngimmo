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
      { property: "og:title", content: "YoungImmo — Logements étudiants vérifiés à Dakar" },
      {
        property: "og:description",
        content:
          "Annonces vérifiées sur le terrain. Prix affichés. Proprio direct. Zéro commission.",
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
      <YiHeader />
      <main className="pt-16">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center fade-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1 mb-6">
            🇸🇳 Dakar · Étudiants
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl mx-auto">
            Trouve ton logement vérifié{" "}
            <span className="text-primary">près du campus</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Annonces vérifiées sur le terrain. Prix affichés. Proprio direct.
            Zéro commission.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/logements"
              className="btn-hover inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 font-semibold shadow-lg shadow-primary/20 hover:scale-[1.03]"
            >
              🏠 Voir les logements dispo
            </Link>
            <a
              href="#assistant"
              className="btn-hover inline-flex items-center justify-center gap-2 rounded-xl bg-accent text-accent-foreground px-6 py-3 font-semibold shadow-lg shadow-accent/30 hover:scale-[1.03]"
            >
              🤖 Demande à l'assistant IA
            </a>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: "🔍", label: "100% des annonces vérifiées sur place" },
              { icon: "💸", label: "0 FCFA de commission pour l'étudiant" },
              { icon: "⚡", label: "Contact proprio en moins de 30 secondes" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-card rounded-2xl p-6 shadow-sm border border-border/60 fade-up"
              >
                <div className="text-3xl">{s.icon}</div>
                <p className="mt-3 font-semibold text-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Témoignage */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
          <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6 sm:p-8 fade-up">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-xl font-bold text-white">
                F
              </div>
              <div className="min-w-0">
                <p className="text-lg text-foreground italic leading-relaxed">
                  « J'ai trouvé mon studio à Fann en 2 jours grâce à YoungImmo.
                  Plus jamais les groupes WhatsApp ! »
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
          <h2 className="text-3xl font-bold text-center text-foreground">
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
                <h3 className="mt-4 font-semibold text-lg text-foreground">
                  {step.title}
                </h3>
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
