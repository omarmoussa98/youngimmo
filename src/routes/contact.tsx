import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { YiHeader } from "@/components/YiHeader";
import { YiFooter } from "@/components/YiFooter";
import { MapPin, Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — YoungImmo Dakar" },
      {
        name: "description",
        content:
          "Une question, un partenariat ou tu es propriétaire ? Écris à l'équipe YoungImmo à Dakar.",
      },
      { property: "og:title", content: "Contact — YoungImmo Dakar" },
      {
        property: "og:description",
        content: "Écris à l'équipe YoungImmo — projet étudiant GET409, Swiss UMEF Dakar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <YiHeader />
      <main className="pt-24 pb-16 max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
          Une question ? Un partenariat ? Écris-nous 💬
        </h1>
        <p className="mt-2 text-muted-foreground">
          On répond en moins de 24h, promis.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="bg-card rounded-2xl p-6 sm:p-8 shadow-md border border-border/60 space-y-4"
          >
            <Field label="Nom complet" name="nom" placeholder="Ex : Fatou Diop" required />
            <Field label="E-mail" name="email" type="email" placeholder="ton.email@exemple.sn" required />
            <Field label="Téléphone" name="tel" type="tel" placeholder="77 XXX XX XX" />
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Message</label>
              <textarea
                required
                rows={5}
                placeholder="Je suis propriétaire et je veux publier mon logement…"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <button
              type="submit"
              className="btn-hover w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white px-6 py-3 font-semibold shadow-lg hover:scale-[1.01]"
            >
              Envoyer mon message 🚀
            </button>
            {sent && (
              <p className="text-sm font-semibold text-[color:var(--success)]">
                Merci ! Ton message a bien été envoyé (démo).
              </p>
            )}
          </form>

          <aside className="bg-card rounded-2xl p-6 sm:p-8 shadow-md border border-border/60 space-y-5 h-fit">
            <h2 className="font-bold text-lg text-foreground">Nos coordonnées</h2>
            <InfoRow icon={<MapPin size={20} />} title="Adresse">
              Swiss UMEF University, Route de Ouakam, Dakar
            </InfoRow>
            <InfoRow icon={<Mail size={20} />} title="E-mail">
              <a className="text-primary hover:underline" href="mailto:youngimmo.dakar@gmail.com">
                youngimmo.dakar@gmail.com
              </a>
            </InfoRow>
            <InfoRow icon={<Phone size={20} />} title="Téléphone">
              <a className="text-primary hover:underline" href="tel:+221770000000">
                +221 77 000 00 00
              </a>
            </InfoRow>
          </aside>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          YoungImmo est un projet étudiant du cours GET409. Les données sont
          fictives à des fins de démonstration.
        </p>
      </main>
      <YiFooter />
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-foreground mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

function InfoRow({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary grid place-items-center">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>
        <p className="text-foreground">{children}</p>
      </div>
    </div>
  );
}
