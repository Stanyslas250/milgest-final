import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Milgest est-il vraiment gratuit ?",
    answer:
      "Oui, pendant toute la phase bêta l'accès est entièrement gratuit et sans engagement. Aucune carte bancaire n'est demandée. Après la bêta, un plan gratuit restera disponible pour les petites organisations.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Absolument. Toutes les communications sont chiffrées (HTTPS), les données sensibles sont chiffrées au repos, et chaque action critique est tracée dans un journal d'audit. Nous respectons les standards RGPD.",
  },
  {
    question: "Puis-je importer mes membres depuis un fichier Excel ?",
    answer:
      "Oui, Milgest propose un import Excel intelligent avec mapping automatique des colonnes, détection des doublons et rapport de validation. Formats acceptés : .xlsx, .xls et .csv.",
  },
  {
    question: "Est-ce adapté aux grandes organisations ?",
    answer:
      "Milgest est conçu pour gérer de 50 à plus de 50 000 membres. L'architecture multi-tenant isole les données de chaque organisation et les listes virtualisées garantissent des performances optimales.",
  },
  {
    question: "Puis-je gérer plusieurs organisations ?",
    answer:
      "Le support multi-organisation est prévu. Chaque organisation dispose de son propre espace isolé avec ses grades, ses templates de documents et ses paramètres personnalisés.",
  },
  {
    question: "Où sont hébergées les données ?",
    answer:
      "Les données sont hébergées sur des infrastructures cloud européennes (PostgreSQL sur Neon, fichiers sur Cloudflare R2). Les serveurs sont monitorés 24/7 via Sentry avec des sauvegardes automatiques.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-500">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Questions fréquentes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Vous avez une question ? Consultez les réponses ci-dessous ou
            contactez-nous directement.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
