import { COMPANY_FULL_NAME, COMPANY_SHORT_NAME } from "@/lib/utils";

export const DEFAULT_SETTINGS = {
  companyName: COMPANY_FULL_NAME,
  shortName: COMPANY_SHORT_NAME,
  phone: process.env.NEXT_PUBLIC_PHONE || "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  email: "info@turancetin.com.tr",
  address: "Türkiye",
  googleMapsUrl: "",
  googleMapsEmbed: "",
  workingHours: {
    weekdays: "Pazartesi - Cumartesi: 09:00 - 19:00",
    saturday: "Cumartesi: 09:00 - 18:00",
    sunday: "Pazar: Kapalı",
  },
  socialLinks: {
    facebook: "",
    instagram: "",
    youtube: "",
    twitter: "",
  },
  footerDescription:
    "Beyaz eşya ve elektrikli küçük ev aletlerinde güvenilir çözüm ortağınız.",
  aboutTitle: "Hakkımızda",
  aboutContent: `${COMPANY_FULL_NAME} olarak beyaz eşya ve elektrikli küçük ev aletleri perakende ticaretinde müşterilerimize kaliteli ürün ve güvenilir hizmet sunuyoruz.`,
  whyUsTitle: "Neden Biz?",
  whyUsItems: [
    {
      title: "Güvenilir Hizmet",
      description: "Şeffaf bilgilendirme ve dürüst satış yaklaşımı.",
      icon: "shield",
    },
    {
      title: "Kaliteli Ürünler",
      description: "Seçkin markalardan güvenilir ürün yelpazesi.",
      icon: "award",
    },
    {
      title: "Geniş Ürün Seçeneği",
      description: "Beyaz eşyadan küçük ev aletlerine geniş katalog.",
      icon: "layers",
    },
    {
      title: "Müşteri Memnuniyeti",
      description: "İhtiyaçlarınıza uygun ürün önerileri.",
      icon: "heart",
    },
    {
      title: "Satış Sonrası Destek",
      description: "Satın alma sonrası iletişim ve yönlendirme.",
      icon: "headphones",
    },
  ],
  seoDefaultTitle: `${COMPANY_SHORT_NAME} | Beyaz Eşya ve Küçük Ev Aletleri`,
  seoDefaultDescription:
    "Beyaz eşya ve elektrikli küçük ev aletlerinde kaliteli ürünler, güncel kampanyalar ve güvenilir danışmanlık.",
};

export type SiteSettingsDTO = typeof DEFAULT_SETTINGS & {
  _id?: string;
  logo?: { url?: string; publicId?: string } | null;
  favicon?: { url?: string; publicId?: string } | null;
  logoSize?: number;
};
