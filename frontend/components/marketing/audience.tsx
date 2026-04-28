import { Landmark, HeartHandshake, Globe, Megaphone } from "lucide-react";

const audiences = [
  {
    icon: Landmark,
    title: "Partis politiques",
    description:
      "Gérez des milliers de militants, suivez les cotisations par section et pilotez la croissance de votre mouvement.",
  },
  {
    icon: HeartHandshake,
    title: "Associations",
    description:
      "Centralisez vos adhérents, automatisez les renouvellements et produisez vos documents officiels en un clic.",
  },
  {
    icon: Globe,
    title: "ONG",
    description:
      "Suivez vos bénévoles et donateurs, générez des reçus fiscaux et gardez une traçabilité complète de vos opérations.",
  },
  {
    icon: Megaphone,
    title: "Syndicats",
    description:
      "Structurez vos délégués par grade et région, suivez les cotisations syndicales et exportez vos statistiques.",
  },
];

export function Audience() {
  return (
    <section id="audience" className="border-t bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-500">
            Pour qui ?
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Conçu pour les organisations engagées
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Que vous gériez 50 ou 50 000 membres, Milgest s&apos;adapte à la
            taille et aux besoins de votre structure.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-2">
          {audiences.map((audience) => (
            <div
              key={audience.title}
              className="flex gap-4 rounded-xl border bg-card p-6 transition-all hover:shadow-md"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white">
                <audience.icon className="size-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {audience.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {audience.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
