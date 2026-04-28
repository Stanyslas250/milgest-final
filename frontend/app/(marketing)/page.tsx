import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Audience } from "@/components/marketing/audience";
import { Pricing } from "@/components/marketing/pricing";
import { FAQ } from "@/components/marketing/faq";
import { CTA } from "@/components/marketing/cta";
import { AnimateIn } from "@/components/marketing/animate-in";

export default function LandingPage() {
  return (
    <>
      <AnimateIn>
        <Hero />
      </AnimateIn>
      <AnimateIn>
        <Features />
      </AnimateIn>
      <AnimateIn>
        <HowItWorks />
      </AnimateIn>
      <AnimateIn>
        <Audience />
      </AnimateIn>
      <AnimateIn>
        <Pricing />
      </AnimateIn>
      <AnimateIn>
        <FAQ />
      </AnimateIn>
      <AnimateIn>
        <CTA />
      </AnimateIn>
    </>
  );
}
