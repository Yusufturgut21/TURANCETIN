import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { getWhatsAppUrl, COMPANY_FULL_NAME } from "@/lib/utils";

type Settings = {
  companyName?: string;
  shortName?: string;
  logo?: { url?: string };
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  footerDescription?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  workingHours?: {
    weekdays?: string;
    sunday?: string;
  };
};

export function Footer({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();
  const name = settings.shortName || "TURANÇETİN";

  return (
    <footer className="mt-auto border-t border-border bg-navy text-white">
      <div className="container-main grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          {settings.logo?.url ? (
            <SmartImage
              src={settings.logo.url}
              alt={name}
              width={150}
              height={40}
              keepAspect
              className="mb-4 max-h-10 object-contain brightness-0 invert"
            />
          ) : (
            <p className="mb-4 font-display text-xl font-semibold">{name}</p>
          )}
          <p className="text-sm leading-relaxed text-white/75">
            {settings.footerDescription ||
              "Beyaz eşya ve elektrikli küçük ev aletlerinde güvenilir çözüm ortağınız."}
          </p>
          <p className="mt-4 text-xs leading-relaxed text-white/55">
            {settings.companyName || COMPANY_FULL_NAME}
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
            Hızlı Bağlantılar
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/urunler" className="hover:text-white">Ürünler</Link></li>
            <li><Link href="/urunler?campaign=1" className="hover:text-white">Kampanyalı Ürünler</Link></li>
            <li><Link href="/markalar" className="hover:text-white">Markalar</Link></li>
            <li><Link href="/hakkimizda" className="hover:text-white">Hakkımızda</Link></li>
            <li><Link href="/iletisim" className="hover:text-white">İletişim</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
            İletişim
          </h3>
          <ul className="space-y-3 text-sm text-white/80">
            {settings.phone ? (
              <li className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </li>
            ) : null}
            {settings.whatsapp ? (
              <li className="flex gap-2">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <a
                  href={getWhatsAppUrl(settings.whatsapp, "Merhaba, bilgi almak istiyorum.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  WhatsApp
                </a>
              </li>
            ) : null}
            {settings.email ? (
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </li>
            ) : null}
            {settings.address ? (
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{settings.address}</span>
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
            Çalışma Saatleri
          </h3>
          <div className="space-y-2 text-sm text-white/80">
            {settings.workingHours?.weekdays ? (
              <p>{settings.workingHours.weekdays}</p>
            ) : null}
            {settings.workingHours?.sunday ? (
              <p>{settings.workingHours.sunday}</p>
            ) : null}
          </div>
          <div className="mt-6 flex gap-3 text-sm">
            {settings.socialLinks?.instagram ? (
              <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white/90">
                Instagram
              </a>
            ) : null}
            {settings.socialLinks?.facebook ? (
              <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white/90">
                Facebook
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-main flex flex-col gap-2 py-5 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>© {year} {name}. Tüm hakları saklıdır.</p>
          <p>Beyaz eşya ve küçük ev aletleri perakende ticareti</p>
        </div>
      </div>
    </footer>
  );
}
