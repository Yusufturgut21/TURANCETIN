import {
  Shield,
  Award,
  Layers,
  Heart,
  Headphones,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  shield: Shield,
  award: Award,
  layers: Layers,
  heart: Heart,
  headphones: Headphones,
};

type Item = {
  title: string;
  description?: string;
  icon?: string;
};

export function WhyUs({
  title,
  items,
}: {
  title: string;
  items: Item[];
}) {
  return (
    <section className="bg-surface py-14 md:py-18">
      <div className="container-main">
        <h2 className="section-title font-display mb-8 md:mb-10">{title}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item) => {
            const Icon = icons[item.icon || ""] || Shield;
            return (
              <div
                key={item.title}
                className="rounded-lg border border-border bg-white p-5"
              >
                <div className="mb-3 inline-flex rounded-md bg-navy/5 p-2.5 text-navy">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-navy">{item.title}</h3>
                {item.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
