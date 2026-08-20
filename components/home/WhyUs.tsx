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
    <section className="py-16 md:py-20">
      <div className="container-main">
        <h2 className="section-title font-display mb-10 md:mb-12">{title}</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {items.map((item, index) => {
            const Icon = icons[item.icon || ""] || Shield;
            return (
              <div key={item.title} className="relative">
                {index < items.length - 1 ? (
                  <div className="absolute top-5 right-0 hidden h-px w-8 bg-border lg:block xl:w-12" />
                ) : null}
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-navy text-white shadow-[0_10px_24px_rgba(11,31,54,0.18)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-semibold text-navy">
                  {item.title}
                </h3>
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
