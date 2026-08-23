import type { Metadata } from "next";
import { getSiteSettingsSafe } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsSafe();
  return {
    title: settings.aboutTitle || "Hakkımızda",
    description: settings.aboutContent?.slice(0, 160),
  };
}

export default async function AboutPage() {
  const settings = await getSiteSettingsSafe();

  return (
    <div className="container-main py-10 md:py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-semibold text-navy md:text-4xl">
          {settings.aboutTitle || "Hakkımızda"}
        </h1>
        <p className="mt-4 text-sm font-medium leading-relaxed text-navy">
          {settings.companyName}
        </p>
        <div className="prose-content mt-6 whitespace-pre-line text-base">
          <p>{settings.aboutContent}</p>
        </div>

        {settings.whyUsItems?.length ? (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-navy">
              {settings.whyUsTitle || "Neden Biz?"}
            </h2>
            <ul className="mt-6 space-y-4">
              {settings.whyUsItems.map((item) => (
                <li
                  key={item.title}
                  className="rounded-lg border border-border bg-white p-4"
                >
                  <h3 className="font-semibold text-navy">{item.title}</h3>
                  {item.description ? (
                    <p className="mt-1 text-sm text-muted">{item.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {(settings as { galleryImages?: { url: string }[] }).galleryImages?.length ? (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-navy">
              Firmamızdan Görüntüler
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(settings as { galleryImages?: { url: string }[] }).galleryImages!.map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-border">
                  <img
                    src={img.url}
                    alt={`Firma görseli ${i + 1}`}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>  );
}
