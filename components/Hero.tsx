import { Stats } from "./Stats";

interface HeroProps {
  active: number;
  available: number;
  total: number;
  mounted: boolean;
}

export function Hero({ active, available, total, mounted }: HeroProps) {
  return (
    <section className="py-12 text-center sm:py-16">
      <h1 className="font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
        Track your <span className="text-gold-gradient">boss respawns.</span>
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base text-muted sm:text-lg">
        Mark a boss as defeated and keep your farming route organised with live
        local countdowns.
      </p>
      <div className="mt-8">
        <Stats
          active={active}
          available={available}
          total={total}
          mounted={mounted}
        />
      </div>
    </section>
  );
}
