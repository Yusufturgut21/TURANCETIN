import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { getSiteSettingsSafe } from "@/lib/settings";
import { getWhatsAppUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Bize ulaşın. Telefon, WhatsApp ve iletişim formu.",
};

export default async function ContactPage() {
  const settings = await getSiteSettingsSafe();

  return (
    <div className="container-main py-10 md:py-14">
      <h1 className="font-display text-3xl font-semibold text-navy">İletişim</h1>
      <p className="mt-2 text-muted">
        Sorularınız için bize ulaşın. Size yardımcı olmaktan memnuniyet duyarız.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="rounded-lg border border-border bg-white p-6">
            <p className="text-sm font-medium text-navy">{settings.companyName}</p>
            <ul className="mt-5 space-y-4 text-sm">
              {settings.phone ? (
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-navy" />
                  <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>
                    {settings.phone}
                  </a>
                </li>
              ) : null}
              {settings.whatsapp ? (
                <li className="flex gap-3">
                  <MessageCircle className="mt-0.5 h-4 w-4 text-navy" />
                  <a
                    href={getWhatsAppUrl(
                      settings.whatsapp,
                      "Merhaba, bilgi almak istiyorum."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {settings.email ? (
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-navy" />
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </li>
              ) : null}
              {settings.address ? (
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-navy" />
                  <span>{settings.address}</span>
                </li>
              ) : null}
              {settings.workingHours?.weekdays ? (
                <li className="flex gap-3">
                  <Clock className="mt-0.5 h-4 w-4 text-navy" />
                  <div>
                    <p>{settings.workingHours.weekdays}</p>
                    {settings.workingHours.sunday ? (
                      <p className="text-muted">{settings.workingHours.sunday}</p>
                    ) : null}
                  </div>
                </li>
              ) : null}
            </ul>
          </div>

          {settings.googleMapsEmbed ? (
            <div
              className="overflow-hidden rounded-lg border border-border [&_iframe]:h-64 [&_iframe]:w-full"
              dangerouslySetInnerHTML={{ __html: settings.googleMapsEmbed }}
            />
          ) : settings.googleMapsUrl ? (
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline inline-flex"
            >
              Haritada Gör
            </a>
          ) : null}
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
