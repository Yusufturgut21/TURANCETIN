import { clsx, type ClassValue } from "clsx";
import slugifyLib from "slugify";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugify(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    locale: "tr",
    trim: true,
  });
}

export function formatPrice(price: number): string {
  return (
    new Intl.NumberFormat("tr-TR", {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(price) + " TL"
  );
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

export function getWhatsAppUrl(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const number = cleaned.startsWith("0")
    ? `90${cleaned.slice(1)}`
    : cleaned.startsWith("90")
      ? cleaned
      : `90${cleaned}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function isCampaignActive(
  startDate?: Date | string | null,
  endDate?: Date | string | null,
  isActive = true
): boolean {
  if (!isActive) return false;
  const now = new Date();
  if (startDate && new Date(startDate) > now) return false;
  if (endDate && new Date(endDate) < now) return false;
  return true;
}

export const COMPANY_SHORT_NAME = "TURANÇETİN";
export const COMPANY_FULL_NAME =
  "TURANÇETİN DAYANIKLI TÜKETİM MALLARI OTOMOTİV İNŞAAT TEKSTİL GIDA İTHALAT İHRACAT SAN. TİC. LTD. ŞTİ.";
