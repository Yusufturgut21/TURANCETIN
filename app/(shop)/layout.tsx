import type { Metadata } from "next";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { FloatingWhatsApp } from "@/components/common/FloatingWhatsApp";
import { getSiteSettingsSafe } from "@/lib/settings";
import { getActiveCategories } from "@/lib/queries";
import { COMPANY_SHORT_NAME } from "@/lib/utils";
import { DEFAULT_SETTINGS } from "@/lib/defaults";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsSafe();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default:
        settings.seoDefaultTitle || `${COMPANY_SHORT_NAME} | Beyaz Eşya`,
      template: `%s | ${settings.shortName || COMPANY_SHORT_NAME}`,
    },
    description: settings.seoDefaultDescription,
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: settings.shortName || COMPANY_SHORT_NAME,
      title: settings.seoDefaultTitle,
      description: settings.seoDefaultDescription,
    },
    robots: { index: true, follow: true },
    icons: settings.favicon?.url ? { icon: settings.favicon.url } : undefined,
  };
}

async function getLayoutData() {
  try {
    const [settings, categories] = await Promise.all([
      getSiteSettingsSafe(),
      getActiveCategories(),
    ]);
    return {
      settings: JSON.parse(JSON.stringify(settings)),
      categories: JSON.parse(JSON.stringify(categories)),
    };
  } catch (error) {
    console.error(
      "[layout]",
      error instanceof Error ? error.message : "DB bağlantısı yok"
    );
    return {
      settings: JSON.parse(JSON.stringify(DEFAULT_SETTINGS)),
      categories: [] as [],
    };
  }
}

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings, categories } = await getLayoutData();

  return (
    <div className="flex min-h-screen flex-col">
      <Header categories={categories} settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <FloatingWhatsApp phone={settings.whatsapp || undefined} />
    </div>
  );
}
