import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section id="cta" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-brand-700 px-6 py-16 text-center sm:px-12 sm:py-20">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Prêt à structurer votre organisation ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-brand-200">
              Rejoignez la bêta gratuite et découvrez comment Milgest peut
              transformer la gestion de vos militants.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-white hover:bg-brand-50 text-brand-700 hover:text-white border-brand-500 h-12 px-8 text-base"
                render={<Link href="/register" />}
              >
                Créer un compte gratuitement
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-brand-500 hover:bg-brand-600 text-white border-brand-500 h-12 px-8 text-base"
                render={<Link href="mailto:contact@milgest.app" />}
              >
                Nous contacter
              </Button>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-brand-500/30" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full bg-brand-600/30" />
        </div>
      </div>
    </section>
  );
}
