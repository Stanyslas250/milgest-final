import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const tiers = [
  {
    name: "Starter",
    price: "Gratuit",
    period: "",
    description: "Pour démarrer avec une petite organisation.",
    features: [
      "Jusqu'à 500 membres",
      "Gestion des cotisations",
      "Import Excel",
      "1 utilisateur admin",
      "Dashboard de base",
    ],
    cta: "Commencer",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "Bientôt",
    period: "",
    description: "Pour les organisations en croissance.",
    badge: "Populaire",
    features: [
      "Membres illimités",
      "Grades & promotions auto",
      "Éditeur de documents",
      "Export PDF + filigrane",
      "5 utilisateurs",
      "Dashboards avancés",
      "Relances automatiques",
    ],
    cta: "Rejoindre la bêta",
    highlighted: true,
  },
  {
    name: "Organisation",
    price: "Sur mesure",
    period: "",
    description: "Pour les grandes structures multi-sites.",
    features: [
      "Tout du plan Pro",
      "Multi-organisation",
      "Utilisateurs illimités",
      "API dédiée",
      "Support prioritaire",
      "Formation personnalisée",
    ],
    cta: "Nous contacter",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-500">
            Tarifs
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Gratuit pendant la bêta
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Profitez d&apos;un accès complet et gratuit pendant toute la phase
            bêta. Aucune carte bancaire requise.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-xl border p-6 ${
                tier.highlighted
                  ? "border-brand-500 bg-card shadow-xl shadow-brand-500/10 ring-1 ring-brand-500"
                  : "bg-card"
              }`}
            >
              {tier.badge && (
                <Badge className="absolute -top-3 left-6 bg-brand-500 text-white hover:bg-brand-500">
                  {tier.badge}
                </Badge>
              )}
              <h3 className="text-lg font-semibold text-foreground">
                {tier.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {tier.description}
              </p>
              <div className="mt-4">
                <span className="text-3xl font-bold text-foreground">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-sm text-muted-foreground">
                    {" "}
                    {tier.period}
                  </span>
                )}
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`mt-8 w-full ${
                  tier.highlighted
                    ? "bg-brand-500 hover:bg-brand-600 text-white"
                    : ""
                }`}
                variant={tier.highlighted ? "default" : "outline"}
                render={<Link href="#cta" />}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
