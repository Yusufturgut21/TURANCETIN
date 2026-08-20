import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import "./globals.css";
import { COMPANY_SHORT_NAME } from "@/lib/utils";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${COMPANY_SHORT_NAME} | Beyaz Eşya ve Küçük Ev Aletleri`,
    template: `%s | ${COMPANY_SHORT_NAME}`,
  },
  description:
    "Beyaz eşya ve elektrikli küçük ev aletlerinde kaliteli ürünler ve güvenilir hizmet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body className={`${manrope.variable} ${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
