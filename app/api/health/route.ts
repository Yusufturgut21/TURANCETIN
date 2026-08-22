import { NextResponse } from "next/server";

/**
 * Ortam değişkenlerinin varlığını (değerleri değil) kontrol eder.
 * Canlıda giriş sorununu teşhis için: /api/health
 */
export async function GET() {
  const authSecret = Boolean(
    process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
  );
  const mongo = Boolean(process.env.MONGODB_URI);
  const authUrl = Boolean(
    process.env.AUTH_URL || process.env.NEXTAUTH_URL
  );
  const siteUrl = Boolean(process.env.NEXT_PUBLIC_SITE_URL);
  const cloudinary =
    Boolean(process.env.CLOUDINARY_CLOUD_NAME) &&
    Boolean(process.env.CLOUDINARY_API_KEY) &&
    Boolean(process.env.CLOUDINARY_API_SECRET);

  const ok = authSecret && mongo;

  return NextResponse.json(
    {
      ok,
      checks: {
        AUTH_SECRET_or_NEXTAUTH_SECRET: authSecret,
        MONGODB_URI: mongo,
        AUTH_URL_or_NEXTAUTH_URL: authUrl,
        NEXT_PUBLIC_SITE_URL: siteUrl,
        CLOUDINARY: cloudinary,
      },
      hint: ok
        ? cloudinary
          ? "Temel ayarlar tamam."
          : "Görsel yükleme için CLOUDINARY_* değişkenlerini ekleyip Redeploy edin."
        : "false olan alanları Vercel → Settings → Environment Variables içine ekleyip Redeploy edin.",
    },
    { status: ok ? 200 : 503 }
  );
}
