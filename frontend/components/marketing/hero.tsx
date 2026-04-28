import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-4xl">
      <div className="rounded-xl border bg-card p-4 shadow-2xl shadow-brand-500/10">
        {/* Top bar */}
        <div className="flex items-center gap-3 border-b pb-3 mb-4">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-red-400" />
            <div className="size-3 rounded-full bg-yellow-400" />
            <div className="size-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-8">
            <div className="mx-auto h-5 w-48 rounded-md bg-muted" />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-4">
          {[
            { label: "Membres actifs", value: "2 847", trend: "+12%" },
            { label: "Cotisations", value: "1,2M XAF", trend: "+8%" },
            { label: "Taux renouvellement", value: "87%", trend: "+3%" },
            { label: "Nouveaux ce mois", value: "142", trend: "+24%" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-lg border bg-background p-3"
            >
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {kpi.label}
              </p>
              <p className="mt-1 text-sm sm:text-lg font-bold font-mono text-foreground">
                {kpi.value}
              </p>
              <p className="text-[10px] sm:text-xs font-medium text-emerald-600">
                {kpi.trend}
              </p>
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="rounded-lg border bg-background p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground">
              Évolution des membres
            </p>
            <div className="flex gap-2">
              <div className="h-5 w-14 rounded bg-muted" />
              <div className="h-5 w-14 rounded bg-muted" />
            </div>
          </div>
          <svg
            viewBox="0 0 400 120"
            className="w-full h-24 sm:h-32"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="chartGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#005985" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#005985" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,100 C30,90 60,80 100,70 C140,60 170,65 200,50 C230,35 260,40 300,25 C340,10 370,15 400,5 L400,120 L0,120 Z"
              fill="url(#chartGradient)"
            />
            <path
              d="M0,100 C30,90 60,80 100,70 C140,60 170,65 200,50 C230,35 260,40 300,25 C340,10 370,15 400,5"
              fill="none"
              stroke="#005985"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full bg-brand-300/10 blur-3xl" />
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/60 px-4 py-1.5 text-sm text-muted-foreground">
            <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
            Bêta gratuite — Accès anticipé disponible
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Gérez vos militants,{" "}
            <span className="text-brand-500">structurez</span> votre
            organisation
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Centralisez membres, cotisations, grades et documents dans un seul
            outil. Des dashboards data-driven pour piloter votre organisation en
            toute clarté.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-brand-500 hover:bg-brand-600 text-white h-12 px-8 text-base"
              render={<Link href="#cta" />}
            >
              Commencer gratuitement
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base"
              render={<Link href="#how" />}
            >
              <Play className="mr-2 size-4" />
              Voir comment ça marche
            </Button>
          </div>
        </div>

        <div className="mt-16 sm:mt-20">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}
