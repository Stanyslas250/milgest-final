import { Upload, FolderKanban, Eye, Lightbulb } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Importez",
    description:
      "Chargez vos fichiers Excel existants. Le mapping intelligent associe vos colonnes aux champs Milgest automatiquement.",
  },
  {
    icon: FolderKanban,
    step: "02",
    title: "Organisez",
    description:
      "Structurez vos membres par grade, région et période d'adhésion. Configurez votre hiérarchie en quelques clics.",
  },
  {
    icon: Eye,
    step: "03",
    title: "Suivez",
    description:
      "Gérez cotisations et dons au quotidien. Les relances automatiques et reçus PDF vous font gagner un temps précieux.",
  },
  {
    icon: Lightbulb,
    step: "04",
    title: "Décidez",
    description:
      "Des dashboards clairs et des graphiques dynamiques vous donnent la vision complète pour piloter votre organisation.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-500">
            Comment ça marche
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Opérationnel en 4 étapes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Pas de formation complexe. Importez vos données existantes et
            commencez à travailler immédiatement.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.step} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="pointer-events-none absolute top-8 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] bg-border lg:block" />
              )}
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
                <step.icon className="size-7" />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-brand-500">
                Étape {step.step}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
