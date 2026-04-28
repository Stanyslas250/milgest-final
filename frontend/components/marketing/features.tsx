import {
  Users,
  Wallet,
  TrendingUp,
  FileText,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Gestion des membres",
    description:
      "Fiches complètes, import Excel, recherche avancée et filtres combinés. Gérez des milliers de militants sans effort.",
  },
  {
    icon: Wallet,
    title: "Cotisations & Dons",
    description:
      "Enregistrement, suivi, relances automatiques et génération de reçus PDF. Gardez le contrôle de vos finances.",
  },
  {
    icon: TrendingUp,
    title: "Grades & Promotions",
    description:
      "Hiérarchie configurable, règles de promotion automatique et historique complet d'évolution de chaque militant.",
  },
  {
    icon: FileText,
    title: "Documents & Filigrane",
    description:
      "Éditeur WYSIWYG, templates avec variables dynamiques et export PDF avec filigrane personnalisable.",
  },
  {
    icon: BarChart3,
    title: "Dashboards data-driven",
    description:
      "KPIs en temps réel, graphiques dynamiques, répartition par grade, région et démographie. Pilotez avec la donnée.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-500">
            Fonctionnalités
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tout ce dont votre organisation a besoin
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Un ERP complet pensé pour les organisations politiques, associations
            et ONG. Chaque module est conçu autour de la donnée.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:shadow-brand-500/5 hover:border-brand-200"
            >
              <div className="flex size-11 items-center justify-center rounded-lg bg-brand-50 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                <feature.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
