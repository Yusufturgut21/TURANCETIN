import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-main flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted">
        404
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-navy">
        Sayfa bulunamadı
      </h1>
      <p className="mt-3 text-muted">
        Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Ana sayfaya dön
      </Link>
    </div>
  );
}
