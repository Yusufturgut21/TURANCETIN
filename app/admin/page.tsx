"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type DashboardData = {
  totalProducts: number;
  activeProducts: number;
  campaignProducts: number;
  categoryCount: number;
  brandCount: number;
  unreadMessages: number;
  recentProducts: { _id: string; title: string; slug: string; createdAt: string }[];
  recentMessages: { _id: string; name: string; message: string; createdAt: string; status: string }[];
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setData(json.data);
        else setError(json.error || "Veriler yüklenemedi.");
      })
      .catch(() => setError("Bir hata oluştu. Lütfen tekrar deneyin."));
  }, []);

  const cards = data
    ? [
        { label: "Toplam Ürün", value: data.totalProducts },
        { label: "Aktif Ürün", value: data.activeProducts },
        { label: "Kampanyalı Ürün", value: data.campaignProducts },
        { label: "Kategori", value: data.categoryCount },
        { label: "Marka", value: data.brandCount },
        { label: "Okunmamış Talep", value: data.unreadMessages },
      ]
    : [];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Genel bakış</p>

      {error ? <p className="mt-4 text-danger">{error}</p> : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-border bg-white p-5"
          >
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-navy">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-navy">Son Eklenen Ürünler</h2>
            <Link href="/admin/urunler" className="text-sm text-navy hover:underline">
              Tümü
            </Link>
          </div>
          <ul className="space-y-3">
            {data?.recentProducts?.map((p) => (
              <li key={p._id} className="flex items-center justify-between gap-3 text-sm">
                <Link href={`/admin/urunler/${p._id}`} className="line-clamp-1 hover:underline">
                  {p.title}
                </Link>
                <span className="shrink-0 text-xs text-muted">
                  {new Date(p.createdAt).toLocaleDateString("tr-TR")}
                </span>
              </li>
            )) || <li className="text-sm text-muted">Henüz ürün yok.</li>}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-navy">Gelen İletişim Talepleri</h2>
            <Link href="/admin/talepler" className="text-sm text-navy hover:underline">
              Tümü
            </Link>
          </div>
          <ul className="space-y-3">
            {data?.recentMessages?.map((m) => (
              <li key={m._id} className="text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{m.name}</span>
                  <span className="text-xs text-muted">
                    {m.status === "unread" ? "Okunmadı" : "Okundu"}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-muted">{m.message}</p>
              </li>
            )) || <li className="text-sm text-muted">Henüz mesaj yok.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
