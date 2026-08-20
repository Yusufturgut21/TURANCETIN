import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";

type Category = {
  _id: string;
  name: string;
  slug: string;
  image?: { url?: string } | null;
};

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-4">
      {categories.map((category) => (
        <Link
          key={category._id}
          href={`/kategori/${category.slug}`}
          className="group relative overflow-hidden rounded-2xl bg-navy shadow-[0_10px_30px_rgba(11,31,54,0.08)]"
        >
          <div className="relative aspect-[4/5] sm:aspect-[4/4.4]">
            {category.image?.url ? (
              <SmartImage
                src={category.image.url}
                alt={category.name}
                fill
                className="object-cover transition duration-700 ease-out group-hover:scale-105"
                sizes="(max-width:768px) 50vw, 20vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-navy to-accent text-3xl font-display text-white/80">
                {category.name.slice(0, 1)}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3.5 md:p-4">
              <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug text-white md:text-[0.95rem]">
                {category.name}
              </h3>
              <p className="mt-1 text-xs text-white/70 opacity-0 transition duration-300 group-hover:opacity-100">
                İncele →
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
