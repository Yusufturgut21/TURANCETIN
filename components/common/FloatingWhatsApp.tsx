"use client";

import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";

export function FloatingWhatsApp({
  phone,
  message = "Merhaba, bilgi almak istiyorum.",
}: {
  phone?: string;
  message?: string;
}) {
  if (!phone) return null;

  return (
    <a
      href={getWhatsAppUrl(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile yazın"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition hover:scale-105 hover:brightness-95 md:bottom-8 md:right-8"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
