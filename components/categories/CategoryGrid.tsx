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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {categories.map((category) => (
        <Link
          key={category._id}
          href={`/kategori/${category.slug}`}
          className="group overflow-hidden rounded-lg border border-border bg-white transition hover:border-navy/30 hover:shadow-sm"
        >
          <div className="relative aspect-[4/3] bg-surface">
            {category.image?.url ? (
              <SmartImage
                src={category.image.url}
                alt={category.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width:768px) 50vw, 20vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface to-white text-sm text-muted">
                {category.name.slice(0, 1)}
              </div>
            )}
          </div>
          <div className="px-3 py-3">
            <h3 className="line-clamp-2 text-sm font-medium text-navy">
              {category.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
